var obj = {};
function fn_chooseCommonPopup(list){
	if(list.length > 0){
		for( i= 0; i < list.length ; i++){
			let exceptPop = $.cookie("except_pop_id_"+list[i].popupntcid);
			if(exceptPop != "Y") {  
				if(list[i].popupTypeCd =="P")fn_openCommonPopup(list[i]); //팝업
				else if(list[i].popupTypeCd =="L")fn_openModal(list[i],'false'); //레이어 모달
				else fn_openModal(list[i],'static'); // 딥 모달  ---> function name 주의 
			}
	    }
	}
}
function fn_openCommonPopup(item){
  var popupOption  ="scrollbars=yes,resizable=no,menubar=no , location=no" ;
      popupOption +=",left="+item.leftLc;
      popupOption +=",width="+item.widthSize;
      popupOption +=",height="+item.vrticlSize;
      popupOption +=",top="+item.topLc;
  var getPopUrl= contextpath + "mng/pop/getPopup.html?popupntcid="+item.popupntcid;
  
  //eval("objWin" + item.popupntcid + " = window.open(getPopUrl, 'objWin" + item.popupntcid+"', popupOption);");    
  obj["objWin" + item.popupntcid] = window.open(getPopUrl, 'objWin'+ item.popupntcid, popupOption);
}
function getDataForCommnonPopup( siteid, menuid ){
	
    let data = {"siteid": siteid,"menuid": menuid};
    try{
    	if(isMainPage){ data = {"siteid": siteid,"expsrLcCd": "M"};	}
    	else if(isGatePage){ data = {"siteid": siteid,"expsrLcCd": "G"};	}
    }catch(e){
              console.log("not main Page");
          }
          
    $.ajax({
              type: "POST",
              url: contextpath + "mng/pop/getDataForCommnonPopup.do",
              data: data,
              dataType: "json"
            }).done(function(response){
          	  fn_chooseCommonPopup(response.popupList);
    });
        
}

function fn_neverShow(id,isChecked){
  (isChecked)? $.cookie("except_pop_id_"+id, "Y", {expires:365, path: '/'}) :$.cookie("except_pop_id_"+id, "N", {expires:365, path: '/'});
}

function getLayerStr(item,bakcdrop){
      
       var layerStr = '<div class="modal fade" id="layer'+item.popupntcid+'"   aria-hidden="true" data-bs-backdrop="'+bakcdrop+'"  >'
        layerStr += '  <div class="modal-dialog modal-lg" role="document" style="width:'+item.widthSize+'px;height:'+item.vrticlSize+'px; left:'+item.leftLc+';top:'+item.topLc+';" >'
        layerStr += '    <div class="modal-content type_2">'
        layerStr += '        <div class="modal-header" id="layer'+item.popupntcid+'header" >'
        layerStr += '            <h4 class="modal-title">'+item.ttl+'</h4>'
        layerStr += '            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close">'
        layerStr += '                <span aria-hidden="true"></span>'
        layerStr += '            </button>'
        layerStr += '        </div>'
        layerStr += '        <div class="modal-body">'
        layerStr += '            <div class="card m-b-10">'
        layerStr += '                <div class="card-block-small" >'
        layerStr += '                     '+item.cn+'';
        layerStr += '                </div>'
        layerStr += '            </div>'
        layerStr += '        </div>'
        layerStr += '        <div class="modal-footer text-left" style="display:block;">'
        layerStr += '         <div class="border-checkbox-section text-left">'                                                                        
        layerStr += '           <div class="border-checkbox-group border-checkbox-group-inverse text-left">'                                                                        
        layerStr += '                 <input type="checkbox" class="border-checkbox text-left" id="checkCookie'+item.popupntcid+'"  onchange=fn_setPopupCookie('+item.popupntcid+')>'
        layerStr += '                 <label class="form-label border-checkbox-label" for="checkCookie'+item.popupntcid+'">다시 보지 않기</label>'                                                 
        layerStr += '           </div>'
        layerStr += '          </div>'
        layerStr += '        </div>'
        layerStr += '    </div>'
        layerStr += '</div>'
        layerStr += '</div>'
	    return layerStr;
}
function fn_openModal(item,bakcdrop){
	$("#layerPopupSapn").append(getLayerStr(item,bakcdrop));
	new bootstrap.Modal("#layer"+item.popupntcid).show();
	
	//dragable 사용 X
	//dragElement($("#layer"+item.popupntcid));
}
function fn_setPopupCookie(id){
    if($("#checkCookie"+id).is(":checked")){
        $.cookie("except_pop_id_"+id, "Y", {expires:365, path: '/'});
        //$("#layer"+id).modal("hide");
    }else{ 
        $.cookie("except_pop_id_"+id, "N", {expires:365, path: '/'});   
    }
}
function fn_parentBrowserSetCookie(id){
    $.cookie("except_pop_id_"+id, "Y", {expires:365, path: '/'});
}
//2022-10-24 modal draggable  기능 추가(사용안함)
function dragElement(elmnt) {
    
  var id = $(elmnt).attr("id");
  elmnt = document.getElementById(id);
  
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV:
    elmnt.onmousedown = dragMouseDown;
  }
  
  //modal 전체 영역에서 드래그 가능하도록
  elmnt.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    
    if((elmnt.offsetTop - pos2) < 0){
        elmnt.style.top = 0+"px";
    }else if (elmnt.offsetTop+elmnt.offsetHeight > window.innerHeight){
        elmnt.style.top = window.innerHeight-elmnt.offsetHeight-5+"px";
    }else{
        elmnt.style.top = (elmnt.offsetTop - pos2)+"px";
    }
    
    if((elmnt.offsetLeft - pos1) < 0){
        elmnt.style.left = 0+"px";
    }else if (elmnt.offsetWidth +elmnt.offsetLeft > window.innerWidth-5){
        elmnt.style.left = (window.innerWidth - elmnt.offsetWidth -5)+"px";
    }else{
        elmnt.style.left = (elmnt.offsetLeft - pos1)+"px";
    }
    
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}





