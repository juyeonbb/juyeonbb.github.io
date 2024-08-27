/**
 * ajax이용중 error발생시 처리
 */
jQuery(function(){
  var token = $("meta[name='_csrf']").attr("content");
  var header = $("meta[name='_csrf_header']").attr("content");

 jQuery.ajaxSetup({
  beforeSend: function(xhr) {
	 xhr.setRequestHeader("AJAX", true);
	 xhr.setRequestHeader(header, token);
  },
  error:function(xhr,e){
	  closeWorkProgress();

	  if(xhr.status==404){
	      alert('해당 요청URL을 찾을 수 없습니다.');
	  }else if(xhr.status==401){
          //alert('세션이 유효하지 않습니다.\n페이지 새로고침을 해주십시오.'); // app.sso.isuse=true 일때 주석해제
		  alert('인증에 실패하였습니다.\n로그인 페이지로 이동합니다.'); // app.sso.isuse=false 일때 주석해제
		  location.href='/'; // app.sso.isuse=false 일때 주석해제
	  }else if(xhr.status==403){
		  alert('접근권한이 없습니다.');
          //location.href='/';
	  }else if(xhr.status==500){
		  alert('내부 서버 오류입니다.');
	  }else if(e === 'parsererror'){
		  if(xhr.responseText == 'DUPLOGOUT'){
			  alert('중복로그인되어 로그아웃 되었습니다.\n로그인 페이지로 이동합니다.');
			  location.href='/';
              xhr.responseText = 'DUPLOGOUT_COMPLETED';
		  }else{
			  alert('데이터를 파싱하는데 실패하였습니다.');
		  }
	  }else if(e === 'timeout'){
		  alert('요청시간이 초과되었습니다.');
	  }else {
		  alert('알수없는 오류가 발생하였습니다.');
	  }
  },
  complete:function(xhr,status){
    if(xhr.responseText == 'DUPLOGOUT'){
      alert('중복로그인되어 로그아웃 되었습니다.\n로그인 페이지로 이동합니다.');
      location.href='/';
    }
  }
 });
});



/*
* 트리구조 확장 / 접기 기능
* */
function fnExpendable($wrapper, option) {
    var opt = jQuery.extend({

        /* 확장 / 접기 대상 선택자 */
        expendableTargetSelector: 'li'

        /*
            확장 / 접기 시 숨겨지거나 보여질 대상 선택자
            반드시 확장/접기 대상의 자식이여야함
        */
        , expendableTargetChildSelector: 'ol'

        /* 확장 / 접기 시 고정으로 표시될 대상 선택자
            - 반드시 확장/접기 대상의 자식이여야함
            - 해당 대상 맨 앞에 확정 접기 버튼 생성
        */
        , expendableFixedTargetChildSelector: 'div'
    }, option);

    var $targets = null;

    $wrapper.on('click', '.expendable-toggle-btn', function () {
        $(this).closest(".expendable-item").toggleClass('expendable-collapse');
    });

    var refresh = function(){
        $wrapper.addClass('expendable-wrapper');
        $wrapper.find(".expendable-item").addClass('expendable-item-old')
        $targets = $wrapper.find(opt.expendableTargetSelector);
        $targets.each(function(){
            var $item = $(this);
            var $fixed = $item.children(opt.expendableFixedTargetChildSelector);
            var $child = $item.children(opt.expendableTargetChildSelector);
            var childContent = $child.html()
            if (childContent && childContent.trim()) {
                $item.removeClass('expendable-item-old').addClass('expendable-item')
                $fixed.addClass("expendable-item-fixed")
                $child.addClass("expendable-item-child")
                if($fixed && $fixed.children().find(".expendable-toggle-btn").length === 0) {
                    $fixed.find(".card-text").prepend($("<button/>").attr({type : 'button'}).addClass("expendable-toggle-btn"))
                }
            }
        });

        $wrapper
            .find('.expendable-item-old').removeClass('expendable-item expendable-item-old')
            .children('.expendable-item-child').removeClass('expendable-item-child').end()
            .children('.expendable-item-fixed').removeClass('expendable-item-fixed')
            .children('.expendable-toggle-btn').remove()
    }

    var expendAll = function(){
        $targets.removeClass('expendable-collapse')
    }
    var collapseAll = function(){
        $targets.addClass('expendable-collapse')
    }

    refresh();

    return {
        refresh: refresh,
        expendAll: expendAll,
        collapseAll: collapseAll,
    }
}

/*
    * 파일 업로더
    * $wrapper: 파일업로더가 추가될 jquery 객체
    *
    * 단일 파일 업로드의 경우
    *  - name: 단일 파일 업로드의 경우 fileId input name
    *  - fileData: FileVO
    *
    *
    * 다중 파일 업로드의 경우
    *  - name: 다중 파일 업로드의 경우 fileGrpId input name
    *  - fileData: FileVO[]
    *
    * options: {
    *    accept: string
    *      - 파일 시 허용할 파일 MIME 타입(벨리데이션 x)
    *    multiple: boolean
    *      - 다중파일 업로드의 경우 true, 기본값: false
    *    readonly: boolean
    *      - true 일 경우 목록 만 표시 추가/삭제 불가
    *    fnValid: (oldFiles: FileVO[], newFiles: fileData[]) => boolean
    *      - 파일 업로드 전 업로드 api 호출할지 확인 콜백, 기본값: () => true
    *    fnFinish: (files: FileVO[]) => void
    *      - 파일 업로드 후 콜백, 기본값: () => {}
    *    bbsid:filegrpNm이 "bbs"인경우 bbsid 값 입력 *없는경우 파일다운로드시 권한 오류 발생*
    *    shallowDelete : true 시 삭제 api 호출 안함 (multiple true 시 사용 불가) 기본값 false
    * }
    *
    * */
function fileUploader($wrapper, filegrpNm, name, fileData, options, bbsid) {

    $wrapper.html('').addClass('file-uploader-wrapper');
    const opt = $.extend({multiple: false, fnValid: ()=> true, fnFinish: ()=> {}, accept: '*', readonly: false, isPass:false}, options);
    const $btn = $("<button/>").attr({'type': 'button'}).addClass('btn btn-inverse btn-sm').text(opt.multiple ? '파일 추가' : '파일 선택');
    const $fileInp = $("<input>").attr({'type': 'file'}).prop({multiple: opt.multiple, accept: opt.accept});
    const $idInp = $("<input>").attr({'type': 'hidden', name}).val('0');
    const $fileList = $("<div>").addClass('file-uploader-list').append($("<span/>").text("파일이 존재하지 않습니다.").addClass('no-file-msg'));
    const $fileTotCntParam = $("<span/>").addClass('file-uploader-tot-cnt-param').text('0');
    const $fileTotSizeParam = $("<span/>").addClass('file-uploader-tot-size-param').text('0B');
    const $fileListInfo = $("<div>").addClass('file-uploader-file-info').append([
        '총 ',
        $fileTotCntParam,
        '개 파일 (',
        $fileTotSizeParam,
        ')'
    ]);
    if(opt.multiple && opt.shallowDelete) {
        alert("옵션 shallowDelete와  multiple 동시 사용 불가.");
        return;
    }
    var $fileItemTemplate = $("<div>").addClass("btn-group file-uploader-list-item").append([
        $("<button/>").addClass('btn btn-inverse btn-sm btn-outline-inverse file-uploader-download-btn').attr({type: 'button'}).append([
            $("<i/>").addClass('icofont icofont-paper-clip'),
            $("<span/>").addClass('file-uploader-filename-param'),
            " (",
            $("<span/>").addClass('file-uploader-filesize-param'),
            ")",
        ]),
        opt.readonly ? '' : $("<button/>").addClass('btn btn-inverse btn-sm btn-outline-inverse file-uploader-delete-btn').attr({type: 'button'}).append(
            $("<i/>").addClass('icofont icofont-ui-delete')
        ),
    ]);

    const fileDataArr = [];
    const append = (item) => {
        if (!opt.multiple) {
            fileDataArr.length = 0;
            $fileList.children(":not(.no-file-msg)").remove();
        }
        $fileList.append(
            $fileItemTemplate.clone(true).data({fileid: item.fileid, filegrpid: item.filegrpid, fileIdntfcKey: item.fileIdntfcKey})
                .find('.file-uploader-filename-param').text(item.orgnlFileNm).css("text-transform", "none").end()
                .find('.file-uploader-filesize-param').text(fileSizePretty(item.fileSize)).end()
        )
        fileDataArr.push(item);
    }
    const refresh = () => {
        $fileTotCntParam.text(fileDataArr.length);
        $fileTotSizeParam.text(fileSizePretty(fileDataArr.reduce((val, item) => val + item.fileSize, 0)));
    }

    const resetFileInp = () => {
        if (detectBrowser() == "other") {
            $fileInp.val("");
        } else {
            $fileInp.replaceWith($fileInp.clone(true))
        }
    }

    let chkConfirmFg = false;
    const chkConfirm = () => {
        if (!chkConfirmFg) {
            chkConfirmFg = confirm("파일 추가/삭제시 페이지 저장여부와 관계없이 반영이 진행됩니다.\n진행하시겠습니까?");
        }
        return chkConfirmFg;
    }

    let isNew = true;
    let filegrpid = null;

    if (opt.multiple) {
        if (fileData && fileData.length) {
            filegrpid = fileData[0].filegrpid;
            $idInp.val(filegrpid);
            isNew = false;
            for (const item of fileData) {
                append(item);
            }
        }
    } else if (fileData){
        filegrpid = fileData.filegrpid;
        $idInp.val(fileData.fileid);
        isNew = false;
        append(fileData);
    }
    if (!filegrpid) {
        filegrpid = 0
    }
    refresh();

    $btn.on('click', function () {
        $fileInp.click();
    });

    $fileInp.on('change', function () {
        if (this.files.length) {
            const oldFileDataArr  = [...(fileDataArr.map(item => ({...item})))];
            if (opt.fnValid(oldFileDataArr, this.files)) {
                if(!isNew && opt.multiple && !chkConfirm()) {
                    $fileInp.val("");
                    return;
                }

                if(displayWorkProgress()){
                    var formData = new FormData();
                    formData.append("filegrpNm", filegrpNm);
                    formData.append("filegrpid", $idInp.val());
                    if(filegrpNm == "bbs") formData.append("bbsid", Number(bbsid));

                    if (opt.multiple) {
                        for(const file of this.files) {
                            formData.append("files", file);
                        }
                        $.ajax({
                            url : contextpath + 'uploadMultipleFiles.do',
                            processData : false,
                            contentType : false,
                            data : formData,
                            type : 'POST',
                            success : function(response) {
                                closeWorkProgress();
                                if (response.result === 'fail') {
                                    alert(response.msg);
                                } else {
									if($idInp.val() == 0){
	                                    $idInp.val(response[0].filegrpid);
									}
                                    for (const file of response) {
                                        append(file);
                                    }
                                    refresh();
                                }
                            }
                        })

                        resetFileInp();
                    } else {
                        formData.append("file", this.files[0]);
                        $.ajax({
                            url : contextpath + 'uploadFile.do',
                            processData : false,
                            contentType : false,
                            data : formData,
                            type : 'POST',
                            success : function(response) {
                                closeWorkProgress();
                                isNew = true;
                                if (response.result === 'fail') {
                                    alert(response.msg);
                                } else {
                                    filegrpid = response.filegrpid;
                                    $idInp.val(response.fileid);
                                    append(response);
                                    refresh();
                                }
                            }
                        });
                    }
                }
                resetFileInp();
            }
        }
    });

    $wrapper.off('click')
        .on('click', '.file-uploader-download-btn', function(){
            const $parent = $(this).closest('.file-uploader-list-item');
            const data = $parent.data();
            const fileNm = $(this).find('.file-uploader-filename-param').text();

            //properties 전역 변수에 의해 사유 입력 결정
            //if(opt.privacyYn) {
            //    openFileDownRsnPopup(opt.popupId, data.filegrpid, data.fileid, data.fileIdntfcKey, fileNm)
            //} else {
            //    downloadFileByFileid(data.fileid, data.fileIdntfcKey);
            //}

            downloadFileByFileid(data.fileid, data.fileIdntfcKey, opt.isPass);

        }).on('click', '.file-uploader-delete-btn', function(){
            const $parent = $(this).closest('.file-uploader-list-item');
            const data = $parent.data();

            if(!isNew && !opt.shallowDelete && !chkConfirm()) {
                $fileInp.val("");
                return;
            }

            const cb = () => {
                if (!opt.multiple) {
                   $idInp.val("");
               }

               $parent.remove()
               fileDataArr.splice(fileDataArr.indexOf(item => item.fileid === data.fileid), 1)
               refresh();
            }
            if(opt.shallowDelete) {
                cb();
            } else {
                if(displayWorkProgress()){
                    $.ajax({
                        url : contextpath + 'deleteFile.do',
                        type: 'GET',
                        cache : false,
                        dataType: 'json',
                        data: {
                            fileid: data.fileid,
                            file_idntfc_key: data.fileIdntfcKey
                        },
                        success : function (data){
                            closeWorkProgress();
                            if(data.result==='success'){
                                cb();
                            }else{
                                alert("파일삭제중 에러가 발생하였습니다. 관리자에게 문의 부탁드립니다.");
                            }
                        }
                    })
                }
            }

        })

    $wrapper.append([
        opt.readonly ? '' : $btn,
        $fileList,
        opt.multiple ? $fileListInfo : '',
        opt.readonly ? '' : $fileInp,
        $idInp
    ]);
}

function deleteFile(fileid, fileIdntfcKey) {
    if (!confirm("파일을 삭제하시겠습니까?")) {
        return;
    }

    let deleteFileUrl = contextpath + "deleteFile.do?fileid=" + fileid + "&file_idntfc_key=" + fileIdntfcKey;
    $.ajax({
        url: deleteFileUrl,
        type: 'GET',
        cache: false,
        dataType: 'json',
        success: function (data) {
            if (data.result == "success") {
                $("#" + fileid).remove();
                alert("파일삭제가 완료 되었습니다.");
            } else {
                alert("파일삭제중 에러가 발생하였습니다. 관리자에게 문의 부탁드립니다.");
            }
        },
        error: function (error) {
        }
    })
}


function getDOMElement(target) {
    if(target instanceof jQuery) { // jquery
        return target[0]
    } else if (typeof target === 'string') { // Id
        return document.getElementById(target)
    } else {
        return target
    }
}

/*******************************
 * dateRangePicker
 * pickerEle  : dateRangePicker input 객체
 * startDtEle : 시작일시 element input 객체 (hidden)
 * endDtEle   : 종료일시 element input 객체 (hidden)
 * option    {
 *  readOnlyInp: 입력필드를 readonly로 전환하고 날짜 표시를 친화적으로 전환 (default: false)
 *  initStrartDt: 초기 시작일시 (default: null)
 *  initEndDt: 초기 시작일시 (default: null)
 *  time: 시간 선택 여부 {
 *      minute: 분 선택 배수 (default: 5)
 *      ampm: 오전오후 여부 (default: false)
 *  } || boolean (default: false)
 *
 *  }(
 *      날짜 형식:
 *          두 값 모두 존재시에만 적용
 *
 *          time false:
 *              YYYY-MM-DD
 *
 *          time true:
 *              YYYY-MM-DD HH:mm:ss
 *  )
 ********************************/
function initDateRangePicker(pickerEle, startDtEle, endDtEle, option) {
    const $picker = $(getDOMElement(pickerEle));
    const $startDt = $(getDOMElement(startDtEle));
    const $endDt = $(getDOMElement(endDtEle));
    const pickerInpFormat = option && option.time ? 'YYYY-MM-DD HH:mm:ss' : 'YYYY-MM-DD';
    const isReadonlyInp = !!(option && option.readOnlyInp);
    let calendarIsShow = false;
    let rangeValAtOpen = null;
    $picker.prop({readonly: isReadonlyInp}).daterangepicker({
        opens: 'left',
        autoUpdateInput: false,
        startDate: $startDt.val() ? moment($startDt.val()) : undefined,
        endDate: $endDt.val() ? moment($endDt.val()) : undefined,
        timePicker: !!(option && option.time),
        timePickerIncrement: (option && option.time && typeof option.time === 'object' && option.time.minute) || 5,
        timePicker24Hour: !(option && option.time && typeof option.time === 'object' && option.time.ampm !== undefined ? !!option.time.ampm : false),
        locale: {
            "separator": " ~ ",                     // 시작일시와 종료일시 구분자
            "format": option && option.time ? 'YYYY-MM-DD HH:mm' : 'YYYY-MM-DD',     // 일시 노출 포맷
            "applyLabel": "적용",                    // 확인 버튼 텍스트
            "cancelLabel": "취소",                   // 취소 버튼 텍스트
            "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
            "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
        }
    }, function (st, en) {
        $startDt.val(st.format(pickerInpFormat));
        $endDt.val(en.format(pickerInpFormat));
        setPickerVal(st, en);
        calendarIsShow = false;
    }).on('show.daterangepicker', function (ev, picker) {
        calendarIsShow = true;
        rangeValAtOpen = $(this).val()
    }).on('hide.daterangepicker', function (ev, picker) {
        if (calendarIsShow) {
            calendarIsShow = false;
            if (rangeValAtOpen && !$(this).val().trim()) {
                $startDt.val('');
                $endDt.val('');
                $picker.val('');
            } else {
                $startDt.val(picker.startDate.format(pickerInpFormat));
                $endDt.val(picker.endDate.format(pickerInpFormat));
                setPickerVal(picker.startDate, picker.endDate);
            }
        }
    }).on('cancel.daterangepicker', function (ev, picker) {
        $startDt.val('');
        $endDt.val('');
        $picker.val('');
    });

    if ($startDt.val() && $endDt.val()) {
        setPickerVal(moment($startDt.val()), moment($endDt.val()));
    }

    function setPickerVal(stDt, enDt) {
        if (isReadonlyInp) {
            $picker.val(getDtRange(stDt, enDt, option && option.time))
        } else {
            $picker.val(stDt.format(pickerInpFormat) + ' ~ ' + enDt.format(pickerInpFormat));
        }

    }

}


/*******************************
* initDateRangePickerWithDropdown
* pickerid  : dateRangePicker id
* startDtId : 시작일시 element id (hidden)
* endDtId   : 종료일시 element id (hidden)
* option    { startDay : 시작일자 endDay : 종료일자 }( format : YYYY-MM-DD => 두 날자 모두 존재시에만 적용)
********************************/
function initDateRangePickerWithDropdown(pickerid,startDtId,endDtId,option){

    if(option != null && option !== undefined && option.startDay!=null && option.endDay!=null){
        $("#"+pickerid).val(option.startDay + "   ~   " + option.endDay);
        $("#"+startDtId).val(option.startDay);
        $("#"+endDtId).val(option.endDay);
    }

    $("#"+pickerid).daterangepicker({
            opens: 'left',
            autoUpdateInput: false,
            showDropdowns: true,
            locale: {
                "separator": " ~ ",                     // 시작일시와 종료일시 구분자
                "format": 'YYYY-MM-DD',     // 일시 노출 포맷
                "applyLabel": "적용",                    // 확인 버튼 텍스트
                "cancelLabel": "취소",                   // 취소 버튼 텍스트
                "daysOfWeek": ["일", "월", "화", "수", "목", "금", "토"],
                "monthNames": ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"],
            }
          }, function(start, end, label) {
            console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
        })

        $("#"+pickerid).on('apply.daterangepicker', function(ev, picker) {
            $("#"+startDtId).val(picker.startDate.format('YYYY-MM-DD'));
            $("#"+endDtId).val(picker.endDate.format('YYYY-MM-DD'));
            $(this).val(picker.startDate.format('YYYY-MM-DD') + '   ~   ' + picker.endDate.format('YYYY-MM-DD'));

            if($("#"+startDtId).is("[onchange]")) {
                $("#"+startDtId).trigger("change");
            }
            if($("#"+endDtId).is("[onchange]")) {
                $("#"+endDtId).trigger("change");
            }
        });

        $("#"+pickerid).on('cancel.daterangepicker', function(ev, picker) {
            $("#"+startDtId).val("");
            $("#"+endDtId).val("");
            $(this).val('');
        });
}


function getDtRange(stDt, enDt, isTime){
    const daysOfWeek = ["일", "월", "화", "수", "목", "금", "토"];
    const ampm = {'AM': '오전', 'PM': '오후'};

    if(isTime) {
        if (stDt.year() !== enDt.year()) {
            return `${stDt.format('YYYY년 MM월 DD일')} (${daysOfWeek[stDt.day()]}) ${ampm[stDt.format('A')]} ${stDt.format('h:mm')} ~ ${enDt.format('YYYY년 MM월 DD일')} (${daysOfWeek[enDt.day()]})  ${ampm[enDt.format('A')]} ${enDt.format('h:mm')}`
        } else if (stDt.month() !== enDt.month()) {
            return `${stDt.format('YYYY년 MM월 DD일')} (${daysOfWeek[stDt.day()]}) ${ampm[stDt.format('A')]} ${stDt.format('h:mm')} ~ ${enDt.format('MM월 DD일')} (${daysOfWeek[enDt.day()]})  ${ampm[enDt.format('A')]} ${enDt.format('h:mm')}`
        } else if (stDt.date() !== enDt.date()) {
            return `${stDt.format('YYYY년 MM월 DD일')} (${daysOfWeek[stDt.day()]}) ${ampm[stDt.format('A')]} ${stDt.format('h:mm')} ~ ${enDt.format('MM월 DD일')} (${daysOfWeek[enDt.day()]})  ${ampm[enDt.format('A')]} ${enDt.format('h:mm')}`
        } else if (stDt.format('A') !== enDt.format('A')) {
            return `${stDt.format('YYYY년 MM월 DD일')} (${daysOfWeek[stDt.day()]}) ${ampm[stDt.format('A')]} ${stDt.format('h:mm')} ~ ${ampm[enDt.format('A')]} ${enDt.format('h:mm')}`
        } else if (stDt.hour() !== enDt.hour()) {
            return `${stDt.format('YYYY년 MM월 DD일')} (${daysOfWeek[stDt.day()]}) ${ampm[stDt.format('A')]} ${stDt.format('h:mm')} ~ ${enDt.format('h:mm')}`
        } else if (stDt.minute() !== enDt.minute()) {
            return `${stDt.format('YYYY년 MM월 DD일')} (${daysOfWeek[stDt.day()]}) ${ampm[stDt.format('A')]} ${stDt.format('h:mm')} ~ ${enDt.format('mm')}`
        } else {
            return `${stDt.format('YYYY년 MM월 DD일')} (${daysOfWeek[stDt.day()]}) ${ampm[stDt.format('A')]} ${stDt.format('h:mm')}`
        }
    } else {
        if (stDt.year() !== enDt.year()) {
            return `${stDt.format('YYYY년 MM월 DD일')} (${daysOfWeek[stDt.day()]}) ~ ${enDt.format('YYYY년 MM월 DD일')} (${daysOfWeek[enDt.day()]})`
        } else if (stDt.month() !== enDt.month()) {
            return `${stDt.format('YYYY년 MM월 DD일')} (${daysOfWeek[stDt.day()]}) ~ ${enDt.format('MM월 DD일')} (${daysOfWeek[enDt.day()]})`
        } else if (stDt.date() !== enDt.date()) {
            return `${stDt.format('YYYY년 MM월 DD일')} (${daysOfWeek[stDt.day()]}) ~ ${enDt.format('MM월 DD일')} (${daysOfWeek[enDt.day()]})`
        } else {
            return `${stDt.format('YYYY년 MM월 DD일')} (${daysOfWeek[stDt.day()]})`
        }
    }
}

/*
* popupId : 팝업을 로드할 태그 id 값
* formId : 엑셀 다운로드시 사용할 form id 값
* excelDownUrl : 엑셀 다운로드시 사용되는 경로
* */
function openExcelDownRsnPopup(popupId, formId, excelDownUrl, menuNm){
    const queryString = `?popupId=${popupId}&formId=${formId}&excelDownUrl=${excelDownUrl}&menuNm=${menuNm}`;
    openPopup(popupId, encodeURI(queryString));
}

/*
* filegrpid : 파일 그룹 아이디
* fileid : 파일 아이디
* fileIdntfcKey : 파일 식별 키
*/
function openFileDownRsnPopup(popupId, filegrpid, fileid, fileIdntfcKey, fileNm) {
	const pageMenuTreeNm = $("#pageMenuTreeNm").val();
	const detailMenuPath = $("#detailMenuPath").val();
	var menuPath = (detailMenuPath!=null && detailMenuPath!='undefined'&& detailMenuPath!='')?detailMenuPath:pageMenuTreeNm;
    const queryString = `?filegrpid=${filegrpid}&fileid=${fileid}&fileIdntfcKey=${fileIdntfcKey}&fileNm=${fileNm}&menuPath=${menuPath}`;
    openPopup(popupId, encodeURI(queryString))
}

function openPopup(popupId, queryString) {
    const $popup = $('#layerPopupSapn' + popupId);
    const popupUrl = contextpath + 'mng/dwnldDsctn/dwnldDsctnPopup.html' + queryString;
    $popup.load(popupUrl, function (response, status, xhr) {
        if (status == "success") {
            $popup.modal('show');
        }
    });
}

function openUserInfoPopup(userid) {
    const popupUrl = contextpath + 'mng/member/userInfoPopupForm.html?userid='+userid;
    $('#userInfoPopup').load(popupUrl, function (response, status, xhr) {
        if (status == "success") {
            $('#userInfoPopup').modal('show');
        }
    });
}

function downloadExcel(multiFormid, url, rsn) {
    if(multiFormid != null && multiFormid != 'null') {
        const formArr = multiFormid.split("/")
        const paramArr = [];
        formArr.forEach(function(frm){
            paramArr.push(...$("#"+frm).serializeArray())
        })
        $.fileDownload(url + "?" + $.param(paramArr) + "&rsnExcel="+ rsn);
    }else {
        $.fileDownload(url);
    }
}
function excelDownloadByMultiForm(multiFormid, url, isPass) {
    const queryString = `?formId=${multiFormid}&excelDownUrl=${url}`;

    if(!isPass) { // 다운로드 사유입력 필요시
        const $popup = $('#dwnldDsctnPopup');
        const popupUrl = contextpath + 'mng/dwnldDsctn/dwnldDsctnPopup.html' + queryString;

        if (displayWorkProgress()) {
            $popup.load(popupUrl, function (response, status, xhr) {
                if (status == "success") {
                    $popup.modal('show');
                }
            });
            closeWorkProgress();
        }
    } else { // 다운로드 사유입력 불필요
        downloadExcel(multiFormid, url);
    }
}

//jSgrid 하단 좌측 totalCount 표출
function prependGridTotalCount(gridContainer,pagenationContainer,totalCount){
	try{

		let pageSize = $("#"+gridContainer).jsGrid("option", "pageSize");

		if(totalCount != null && totalCount != 'undefiend' && totalCount > 0 ){
		    $("#"+pagenationContainer).prepend('<div class="grid-total" style="float:left;padding:7px;"><span style=" font-weight:600;">'+addComma3(totalCount) +'</span> 건</div>');
			$("#"+pagenationContainer).css("display","block");
		    /*if(totalCount <= pageSize){
				$("#"+pagenationContainer+" .jsgrid-pager").css("display","none");
			}*/
		}

		let el = '<select class="sizeNum form-select form-control" style="width: auto; display: initial; font-size: 0.8rem;">';
        el += '<option value="10">10</option>';
        el += '<option value="20">20</option>';
        el += '<option value="30">30</option>';
        el += '<option value="50">50</option>';
        el += '<option value="100">100</option>';
        el += '<option value="500">500</option>';
        el += '<option value="1000">1000</option>';
        el += '<option value="2000">2000</option>';
        el += '<option value="3000">3000</option>';
        el += '<option value="4000">4000</option>';
        el += '<option value="5000">5000</option>';
        el += '<option value="6000">6000</option>';
        el += '</select>';
        $('#' + pagenationContainer + ' .jsgrid-pager').append(el).on('change', function() {
            $('#' + gridContainer).jsGrid('option', 'pageSize', $(this).find('.sizeNum').val());
        });
        $('#' + pagenationContainer + ' .sizeNum').val(pageSize);

        $('.jsgrid-cell').each(function() {
            $(this).attr('title', $(this).text());
        });
	}catch(e){
		console.log(e)
	}
}

/**
 * SNB
 *  **/

function updateButtons() {
    let items = $('.item');
    items.find('._btnMenuUp, ._btnMenuDown').removeClass('disabled');
    items.first().find('._btnMenuUp').addClass('disabled');
    items.last().find('._btnMenuDown').addClass('disabled');
}

// Move up
$('._btnMenuUp').on('click', function () {
    if ($(this).hasClass("disabled")) return;
    let parent = $(this).closest('.item');
    parent.prev().before(parent);
    updateButtons();
});

// Move down
$('._btnMenuDown').on('click', function () {
    if ($(this).hasClass("disabled")) return;
    let parent = $(this).closest('.item');
    parent.next().after(parent);
    updateButtons();
});

// Remove
$('._btnMenuRemove').on('click', function () {
    $(this).closest('.item').remove();
    updateButtons();
});

updateButtons();

//개인정보 사유 입력을 위한 ajax callBack function
function ajaxCmmCallBack(response,xhr,callbackFunction,cancelCallbackFunction){

	   let detailMenuPath  = xhr.getResponseHeader("detailMenuPath");
       if(detailMenuPath!=null && detailMenuPath!='undefined' && detailMenuPath!=''){
	       $("#detailMenuPath").val(decodeURIComponent(detailMenuPath).replaceAll("+"," ") );
	   }else{
	       $("#detailMenuPath").val("");
	   }

	   $('#ajaxMenuTitle').text("");
       let menuPath = xhr.getResponseHeader("prvcInclsMenu");
       let prvcInclsYn = xhr.getResponseHeader("prvcInclsYn");

       $('#ajaxMenuTitle').text(decodeURIComponent(menuPath).replaceAll("+"," "));

       try{
		    if(typeof callbackFunction === 'function'){
		      		ajaxCmmCallback = callbackFunction;
			}else{
				ajaxCmmCallback = function(){alert("ajax error occured");};
			}

		    if(typeof cancelCallbackFunction === 'function'){
		      		ajaxCmmCancelCallback = cancelCallbackFunction;
			}else{
				ajaxCmmCancelCallback = function(){};
			}

	      	if(prvcInclsYn == "Y"){
		       	ajaxCmmCallBackData = response;
	      	    var $popup = $('#accessReasonPopupForAjax');
	      	    $popup.modal('show');
	      	}else{
	      		ajaxCmmCallback =null;
	      		ajaxCmmCancelCallback =null;
	      		ajaxCmmCallBackData =null;
	      		callbackFunction(response);
	        }
	   }catch(e){
		   alert("ajax error occured");
	   }
 }

 //admin file download
 function downloadFileByFileid(fileId, fileIdntfcKey, isPass){
	 const fileDownloadRsnUse = $("#fileDownloadRsnUse").val();
	 if(!isPass){
        const queryString = `?fileid=${fileId}&fileIdntfcKey=${fileIdntfcKey}`;
        const $popup = $('#dwnldDsctnPopup');
	    const popupUrl = contextpath + 'mng/dwnldDsctn/dwnldDsctnPopup.html' + queryString;
	    $popup.load(popupUrl, function (response, status, xhr) {
	        if (status == "success") {
	            $popup.modal('show');
	        }
	    });
	 }else{
	    downloadFile(fileId, fileIdntfcKey);
	 }
  }

  function downloadFile(fileId, fileIdntfcKey,rsn){
   	    const pageMenuTreeNm = $("#pageMenuTreeNm").val();
	    const detailMenuPath = $("#detailMenuPath").val();
	    var menuPath = (detailMenuPath!=null && detailMenuPath!='undefined'&& detailMenuPath!='')?detailMenuPath:pageMenuTreeNm;
	    var reason = "";
	    if(rsn !== null && rsn !==undefined &&rsn !=''){
			reason=rsn;
		}
	  	$.fileDownload(contextpath + 'downloadFileByFileid.do?fileid='+fileId + '&file_idntfc_key=' + fileIdntfcKey+'&menuPath='+menuPath+'&rsn='+reason, {
	    //successCallback: function (url) {},
	    failCallback: function(html, url) {
	    	if(html=='404'){
	    		alert("파일이 없습니다. 관리자에게 문의하세요.");
	    	}else if(html=='403'){
                alert("권한이 없습니다. 관리자에게 문의하세요.");
            }
	    }
	 });
  }


/*
 * Switchery 사용하여 스위치 생성 공통, 체크 여부에 따라 Y|N 값이 input:hidden에 들어감, 체크값 변경 시 input:hidden에 change 이벤트 발동
 *
 * Param:
 * inpEle: 스위치 대상 input:hidden 객체: input:hidden , title값으로 스위치 우측 라벨 생성
 * EX) <input type="hidden" id="useYn" name="useYn" value="Y" title="사용">
 *
 * option: {
 *   yVal: 체크시 값 default: 'Y'
 *   nVal: 체크 해제시 값 default: 'N'
 *   size: switchery 사이즈 default: 'small'
 *   checkBoxId: 체크박스에 들어갈  ID default: inpEle id가 있는 경우=> (id)Switch, 없으면 임의값
 * }
 *
 * Return {
 *   enable(): Switchery enable 실행 및 input:hidden prop에 disabled 해제
 *   disable(): Switchery enable 실행 및 input:hidden prop에 disabled 설정
 * }
 *
 * */
function initSwitchery(inpEle, option){
    const yVal =  (option && option.yVal) || 'Y';
    const nVal =  (option && option.nVal) || 'N';
    const $inp = $(getDOMElement(inpEle))
    const switchId = (option && option.checkBoxId) || ($inp.is('[id]') ? $inp.attr('id') + 'Switch' : `switch${Math.random().toString(36).substring(2, 12)}`);
    const $checkbox = $("<input/>").attr({type:'checkbox', id: switchId}).prop({checked: $inp.val() === yVal, disabled: $inp.is(':disabled')})
    const $label = $("<label/>").css({'vertical-align': 'middle'}).attr({for: switchId}).text($inp.attr('title'));

    if($inp.val() !== yVal) {
        $inp.val(nVal)
    }

    $inp.after([
        $checkbox, ' ',
        $label
    ]);

    $checkbox.addClass('js-single-small').on('change', function(){
        $inp.val($(this).is(':checked') ? yVal : nVal).change()
    })

    const switchery = new Switchery($checkbox[0], {
        size: (option && option.size) || 'small'
    });

    return {
        disable: function(){
            $inp.prop({disabled: true});
            switchery.disable();
        },
        enable: function(){
            $inp.prop({disabled: false});
            switchery.enable();
        }
    }
}

function initAddableList(wrapperEle, dataArr, fnGenItem, option){
    const optMax = (option && option.max) || 0
    const optMin = (option && option.min) || 1

    const $wrapper = $(getDOMElement(wrapperEle)).addClass('addable-list-wrapper');
    const $addBtn = $("<button/>").attr({type: 'button'}).addClass('btn btn-primary btn-sm input-group-text').text('+')
    const $list = $("<div/>").addClass('addable-list')

    $wrapper.append([
        $addBtn, $list
    ]);

    $addBtn.on('click', function(){
        addData(null);
    });
    if(dataArr) {
        for (const item of dataArr) {
            addData(item);
        }
    }
    if (optMin > 0) {
        for(let i = (dataArr && dataArr.length) || 0; i < optMin; i++) {
            addData(null);
        }
    }

    $list.on('click', '.addable-list-remove-item-btn', function(){
        $(this).closest('.addable-list-item').remove();
        updateItem();
    });

    updateItem();
    function addData(data){
        if (optMax > 0 && optMax <= $list.children().length ) {
            return;
        }
        const $item = $("<div/>").addClass('addable-list-item');
        $item.append(
            $("<button/>").attr({type: 'button'}).addClass('btn btn-primary btn-sm input-group-text addable-list-remove-item-btn').text('-'),
            $("<div/>").addClass('addable-list-item-content-wrapper').append(fnGenItem(data))
        );
        $list.append($item);
        updateItem();
    }

    function updateItem(){
        const itemCnt = $list.children().length
        $list.find('.addable-list-remove-item-btn').prop({disabled: optMin > 0 && itemCnt <= optMin})
        $addBtn.find('.addable-list-remove-item-btn').prop({disabled: optMax > 0 && itemCnt >= optMax})
    }
}

function initCustomSortableTable(tableEle, cb){
    const $table = $(getDOMElement(tableEle));
    let isMoving = false;
    let isActive = false;
    let $trs = false;
    let $curTr = false;
    $table.addClass('cst-table')
    $table.on('click', '.cst-td>button', function (){
        if(isActive){
            isActive = false;
            $table.removeClass('cst-active');
            const curIndex = $curTr.index('.cst-tr');
            const trgtIndex = $(this).closest('tr').index('.cst-tr');

            $trs.removeClass('cst-tr cst-cur-tr cst-trgt-tr');

            if(curIndex !== trgtIndex) {
                cb(curIndex, trgtIndex)
            }
            return;
        }
        isMoving = false;
        isActive = true;
        $table.addClass('cst-active').removeClass('cst-moving');
        $curTr = $(this).closest('tr').addClass('cst-cur-tr');
        $trs = $table.find('.cst-td').closest('tr').addClass('cst-tr');

    }).on('mousedown', '.cst-td', function (){
        if(isActive) {
            return;
        }
        isMoving = true;
        $table.addClass('cst-moving').removeClass('cst-active');
        $curTr = $(this).closest('tr').addClass('cst-cur-tr')
        $trs = $table.find('.cst-td').closest('tr').addClass('cst-tr');
    }).on('mouseup', function (e){
        if(isMoving) {
            $table.removeClass('cst-moving');
            $trs.removeClass('cst-tr cst-cur-tr cst-trgt-tr');
            isMoving = false;
        }
    }).on('mouseup', '.cst-tr', function (e){
        if(isMoving) {
            $table.removeClass('cst-moving');
            isMoving = false;
            const curIndex = $curTr.index('.cst-tr');
            const trgtIndex = $(this).index('.cst-tr');
            $trs.removeClass('cst-tr cst-cur-tr cst-trgt-tr');

            if(curIndex !== trgtIndex) {
                cb(curIndex, trgtIndex)
            }
        }
    }).on('mouseleave', function (){
        if(isMoving) {
            $table.removeClass('cst-moving');
            $trs.removeClass('cst-tr cst-cur-tr cst-trgt-tr');
            isMoving = false;
        }
    }).on('mouseenter', '.cst-tr', function (){
        if(isMoving) {
            $trs.removeClass('cst-trgt-tr');
            $(this).addClass('cst-trgt-tr');
        }
    });
}


var sendSmsPopup;
var sendEmailPopup;
/*
* sms 전송팝업 공통
* options {
*   userids: TB_CMM_USER.USERID로 전송 대상 불러오기
*   drmncyUserids: TB_CMM_USER_DRMNCY.USERID로 전송 대상 불러오기 (휴면 회원)
*   sendTargets: {nm: string, moblphon: string, bplcNm?: string, userid?: string, acnt?: string}[] 형식으로 전송 대상 불러오기
* }
* */
function openSendSmsPopup(options){
    const userids = options.userids ?? [];
    const drmncyUserids = options.drmncyUserids ?? [];
    const sendTargets = options.sendTargets ?? [];
    const trgtCrssesid = options.trgtCrssesid ?? null;

    const data = [];
    data.push({name: 'trgtCrssesid', value: trgtCrssesid})

    let $popup = $('#sendSmsPopup');
    if(!$popup.length) {
        $popup = $('<div/>').appendTo('body').addClass('modal fade').attr({id: 'sendSmsPopup', 'tabindex': '-1', 'role': 'dialog', 'aria-labelledby': 'sendSmsPopupLabel', 'aria-hidden': 'true'}).data({bsBackdrop: 'static'});
    }
    for (const item of userids) {
        data.push({name: 'userids', value: item})
    }

    for (const item of drmncyUserids) {
        data.push({name: 'drmncyUserids', value: item})
    }

    for (const item of sendTargets) {
        data.push({name: 'moblphons', value: item.moblphon || ''})
        data.push({name: 'nms', value: item.nm || ''})
        data.push({name: 'bplcNms', value: item.bplcNm || ''})
        data.push({name: 'tUserids', value: item.userid || ''})
        data.push({name: 'acnt', value: item.acnt || ''})
    }

    $popup.load(contextpath + 'mng/cmm/smsPop.html?' + $.param(data), function(){
        sendSmsPopup = new bootstrap.Modal($popup);
        sendSmsPopup.show();
    });
}

function openSendZoomSmsPopup(options, crssesid){
    const userids = options.userids ?? [];
    const drmncyUserids = options.drmncyUserids ?? [];
    const sendTargets = options.sendTargets ?? [];
    let $popup = $('#sendSmsPopup');
    if(!$popup.length) {
        $popup = $('<div/>').appendTo('body').addClass('modal fade').attr({id: 'sendSmsPopup', 'tabindex': '-1', 'role': 'dialog', 'aria-labelledby': 'sendSmsPopupLabel', 'aria-hidden': 'true'}).data({bsBackdrop: 'static'});
    }
    const data = [];
    for (const item of userids) {
        data.push({name: 'userids', value: item})
    }

    for (const item of drmncyUserids) {
        data.push({name: 'drmncyUserids', value: item})
    }

    for (const item of sendTargets) {
        data.push({name: 'moblphons', value: item.moblphon || ''})
        data.push({name: 'nms', value: item.nm || ''})
        data.push({name: 'bplcNms', value: item.bplcNm || ''})
        data.push({name: 'tUserids', value: item.userid || ''})
        data.push({name: 'acnt', value: item.acnt || ''})
    }

    $popup.load(contextpath + 'mng/cmm/smsPop.html?' + $.param(data) + "&type=zoom" + "&crssesid=" + crssesid, function(){
        sendSmsPopup = new bootstrap.Modal($popup);
        sendSmsPopup.show();
    });
}


/*
* email 전송팝업 공통
* options {
*   userids: TB_CMM_USER.USERID로 전송 대상 불러오기
*   drmncyUserids: TB_CMM_USER_DRMNCY.USERID로 전송 대상 불러오기 (휴면 회원)
*   sendTargets: {nm: string, eml: string, bplcNm?: string, userid?: string, acnt?: string}[] 형식으로 전송 대상 불러오기
* }
* */
function openSendEmailPopup(options){
    const userids = options.userids ?? [];
    const drmncyUserids = options.drmncyUserids ?? [];
    const sendTargets = options.sendTargets ?? [];
    const trgtCrssesid = options.trgtCrssesid ?? null;
    let $popup = $('#sendEmailPopup');
    if(!$popup.length) {
        $popup = $('<div/>').appendTo('body').addClass('modal fade').css('z-index','9995').attr({id: 'sendEmailPopup', 'tabindex': '-1', 'role': 'dialog', 'aria-labelledby': 'sendSmsPopupLabel', 'aria-hidden': 'true', 'data-bs-focus' : 'false'}).data({bsBackdrop: 'static'});
    }
    const data = [];
    data.push({name: 'trgtCrssesid', value: trgtCrssesid})
    for (const item of userids) {
        data.push({name: 'userids', value: item})
    }

    for (const item of drmncyUserids) {
        data.push({name: 'drmncyUserids', value: item})
    }

    for (const item of sendTargets) {
        data.push({name: 'emls', value: item.eml || ''})
        data.push({name: 'nms', value: item.nm || ''})
        data.push({name: 'bplcNms', value: item.bplcNm || ''})
        data.push({name: 'tUserids', value: item.userid || ''})
        data.push({name: 'acnt', value: item.acnt || ''})
    }

    $popup.load(contextpath + 'mng/cmm/emailPop.html?' + $.param(data), function(){
        sendEmailPopup = new bootstrap.Modal($popup);
        sendEmailPopup.show();
    });
}

function openSendZoomEmailPopup(options, crssesid){
    const userids = options.userids ?? [];
    const drmncyUserids = options.drmncyUserids ?? [];
    const sendTargets = options.sendTargets ?? [];
    let $popup = $('#sendEmailPopup');
    if(!$popup.length) {
        $popup = $('<div/>').appendTo('body').addClass('modal fade').css('z-index','9995').attr({id: 'sendEmailPopup', 'tabindex': '-1', 'role': 'dialog', 'aria-labelledby': 'sendSmsPopupLabel', 'aria-hidden': 'true', 'data-bs-focus' : 'false'}).data({bsBackdrop: 'static'});
    }
    const data = [];
    for (const item of userids) {
        data.push({name: 'userids', value: item})
    }

    for (const item of drmncyUserids) {
        data.push({name: 'drmncyUserids', value: item})
    }

    for (const item of sendTargets) {
        data.push({name: 'emls', value: item.eml || ''})
        data.push({name: 'nms', value: item.nm || ''})
        data.push({name: 'bplcNms', value: item.bplcNm || ''})
        data.push({name: 'tUserids', value: item.userid || ''})
        data.push({name: 'acnt', value: item.acnt || ''})
    }

    $popup.load(contextpath + 'mng/cmm/emailPop.html?' + $.param(data) + "&type=zoom" + "&crssesid=" + crssesid, function(){
        sendEmailPopup = new bootstrap.Modal($popup);
        sendEmailPopup.show();
    });
}

// 금액 콤마 표시
$(document).on('keyup', '.amt', function(e) {
    if(e.key == 'ArrowLeft' || e.key == 'ArrowRight') {
        return false;
    }
    deleteComma(this);
    let val = $(this).val();
    if(isNaN(val)) {
        let regex = /[^0-9,]/g;
        $(this).val(val.replace(regex, ''));
    }
    $(this).val(addComma3($(this).val()));
});
// 금액 콤마 삭제(전송전)
function removeComma() {
    $('.amt').each(function() {
        let val = $(this).val().replace(/,/gi, '');
        $(this).val(val);
    });
}
// 100 이상 입력방지
$(document).on('keyup', '.score100', function(e) {
    if(e.key == 'ArrowLeft' || e.key == 'ArrowRight') {
        return false;
    }
    let val = parseInt($(this).val() , 10);
    if(val > 100) {
        val = 100;
        $(this).val(val);
    }
});


function setNextDepth(grpcd, upprcd, targetId) {
    fn_getNextDepthList(grpcd, upprcd, targetId);
}

function fn_getNextDepthList(grpcd, upprcd, targetId) {

    $.ajax({
        url: contextpath + "mng/customAttr/grpCodeList.do",
        type: 'GET',
        cache: false,
        async: false,
        dataType: 'json',
        data: {
            grpcd: grpcd
            , upprcd: upprcd
        },
        success: function (data) {
            writeCodeHtml(grpcd, targetId, data, "");
        },
        error: function (error) {
        }

    });
}

function writeCodeHtml(grpcd, targetId, list, selected) {
    var cntArr = targetId.split("_");
    var nextCnt = Number(cntArr[1]) + 1;
    var nextTarget = cntArr[0] + "_" + nextCnt;


    var html = "";

    html = "<select id='" + targetId + "' class ='form-control' onchange=setNextDepth('" + grpcd + "',this.value,'" + nextTarget + "')>";

    html += "    <option value=''>- 선택 -</option>";

    for (var i = 0; i < list.length; i++) {
        if (list[i].cdid == selected) {
            html += "    <option value=" + list[i].cd + " selected>" + list[i].cdNm + "</option>";
        } else {
            html += "    <option value=" + list[i].cd + ">" + list[i].cdNm + "</option>";
        }
    }
    if (list.length == 0 && jQuery("#" + nextTarget)[0] != undefined) {
        writeCodeHtml(grpcd, nextTarget, list, selected);
    }
    html += "    </select>";
    $("#" + targetId).html(html);
}

function openCrsSearchPopup(attributeValue, eduTypeCd, educyclTagid, setTagNmid) {
	if(setTagNmid != null && setTagNmid != "") {
		if(eduTypeCd != null && eduTypeCd != "" && educyclTagid != null && educyclTagid != "") {
			var popupUrl = contextpath + 'cmm/search/crsSearchPopup.html?attributeValue=' + attributeValue + '&eduTypeCd=' + eduTypeCd + '&educyclTagid=' + educyclTagid + '&setTagNmid=' + setTagNmid;
		}else if(eduTypeCd != null && eduTypeCd != "" && (educyclTagid == null || educyclTagid == "")) {
			var popupUrl = contextpath + 'cmm/search/crsSearchPopup.html?attributeValue=' + attributeValue + '&eduTypeCd=' + eduTypeCd + '&setTagNmid=' + setTagNmid
		}else if((eduTypeCd == null || eduTypeCd == "") && educyclTagid != null && educyclTagid != "") {
			var popupUrl = contextpath + 'cmm/search/crsSearchPopup.html?attributeValue=' + attributeValue + '&educyclTagid=' + educyclTagid + '&setTagNmid=' + setTagNmid;
		}else {
			var popupUrl = contextpath + 'cmm/search/crsSearchPopup.html?attributeValue=' + attributeValue + '&setTagNmid=' + setTagNmid;
		}
	}else {
		if(eduTypeCd != null && eduTypeCd != "" && educyclTagid != null && educyclTagid != "") {
			var popupUrl = contextpath + 'cmm/search/crsSearchPopup.html?attributeValue=' + attributeValue + '&eduTypeCd=' + eduTypeCd + '&educyclTagid=' + educyclTagid;
		}else if(eduTypeCd != null && eduTypeCd != "" && (educyclTagid == null || educyclTagid == "")) {
			var popupUrl = contextpath + 'cmm/search/crsSearchPopup.html?attributeValue=' + attributeValue + '&eduTypeCd=' + eduTypeCd
		}else if((eduTypeCd == null || eduTypeCd == "") && educyclTagid != null && educyclTagid != "") {
			var popupUrl = contextpath + 'cmm/search/crsSearchPopup.html?attributeValue=' + attributeValue + '&educyclTagid=' + educyclTagid;
		}else {
			var popupUrl = contextpath + 'cmm/search/crsSearchPopup.html?attributeValue=' + attributeValue
		}
	}

    if (displayWorkProgress()) {
        $("#crsSearchPopup").load(popupUrl, function (response, status, xhr) {
            if (status == "success") {
                crsSearchPopupModal = new bootstrap.Modal($("#crsSearchPopup"));
                crsSearchPopupModal.show();
            }
            closeWorkProgress();
        });
    }
}

function openEduCyclListPopup(eduTypeCd, eduYrTagid, targetId) {
    var url = contextpath + "cmm/search/eduCyclSearchPopup.html?" + $.param({
        eduTypeCd,
        eduYrTagid,
        targetId,
    });

    if (displayWorkProgress()) {
        $("#eduCyclSearchPopup").load(url, function (response, status, xhr) {
            if (status == "success") {
                eduCyclSearchPopup = new bootstrap.Modal($('#eduCyclSearchPopup'));
                eduCyclSearchPopup.show();
            }
            closeWorkProgress();
        });
    }
}

function openQestnrListPopup(qestnrKndCd, srvyid){
        $.ajax({
            url: contextpath + "mng/srvy/selectSrvyCheckSbmsn.do",
            type: "POST",
            cache: false,
            dataType: "json",
            data: {"srvyid": srvyid},
            success: function (response) {
                if (response.srvyCheckSbmsn > 0) {
                    return alert("제출한 설문자가 있어 설문지 수정이 불가능합니다.");

                } else {
                    var url = contextpath + "cmm/search/qestnrSearchPopup.html?qestnrKndCd=" + qestnrKndCd;
                    $("#qestnrSearchPopup").load(url, function (response, status, xhr) {
                        if (status == "success") {
                            qestnrSearchPopup = new bootstrap.Modal($('#qestnrSearchPopup'));
                            qestnrSearchPopup.show();
                        }
                    });
                }
            },
            error: function (response) {
                return alert("설문지 팝업 불러오기에 실패했습니다");
            }
        })
}

/*
    기업 검색 공통 팝업
    instid : kattr:select_inst에서 설정한 attributeValue (required)
    bplcSelecteid : th:attr에서 설정한 사업장 select 태그 id (optional)
    callbackFunction : th:attr에서 설정한 콜백함수, instid 변경시 실행 (optional)
*/
function openInstListPopup(instid, bplcSelectid, callbackFunction) {
    let url = contextpath + "cmm/search/instSearchPopup.html";

    if (displayWorkProgress()) {
        $("#instSearchPopup").load(url, function (response, status, xhr) {
            if (status == "success") {
                instSearchPopup = new bootstrap.Modal($('#instSearchPopup'));
                instSearchPopup.show();

                searchInstList.instid = instid;
                searchInstList.bplcSelectid = bplcSelectid;
                searchInstList.callback = callbackFunction;
            }
            closeWorkProgress();
        });
    }
}

/*
    사업장 검색 공통 팝업
    bplcid : kattr:select_bplc_id 설정한 attributeValue (required)
    callbackFunction : th:attr에서 설정한 콜백함수, bplcid 변경시 실행 (optional)
*/
function openBplcListPopup(bplcid, callbackFunction, _this) {
    let url = contextpath + "cmm/search/bplcSearchPopup.html";

    if (displayWorkProgress()) {
        $("#commonBplcSearchPopup").load(url, function (response, status, xhr) {
            if (status == "success") {
                commonBplcSearchPopup = new bootstrap.Modal($('#commonBplcSearchPopup'));
                commonBplcSearchPopup.show();
                searchBplcList.bplcid = bplcid;
                searchBplcList.callback = callbackFunction;
            }
            closeWorkProgress();
        });
    }
}

function checkSelectedVal(selectElement, ...values) {
    const selectedVal = $(getDOMElement(selectElement)).val();
    return values.includes(selectedVal);
}