
/**
 * 밸리데이터 커스텀 메소드 추가 가능 --> 옵션으로 사용가능
 * @since 19.04.11
 * 
 * **/
//hangulOrAlpha
//한글 또는 알파벳  
$.validator.addMethod("hangulOrAlpha", function(value, element) {
	   var regExp = /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|\*]+$/;
	   if( value.match(regExp) != null ){ return true; 
	    }else{ return false}
});

//메소드명 : alphanumeric 
//기능 : 숫자와 알파벳만 사용 커스텀
jQuery.validator.addMethod("alphanumeric", function(value, element) {
  return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
});

//메소드명 : isPhone 
//기능 : 숫자와 '-' 기호만 
jQuery.validator.addMethod("isPhone", function(value, element) {
  return this.optional(element) || /^[0-9-]+$/.test(value);
});

//메소드명 : 이메일 도메인 (영문 , '.' 두가지만 ) 
//기능 : 영문 , '.','-','_' 
jQuery.validator.addMethod("emailDomain", function(value, element) {
	 //var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
	 var regExp = /[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*[.][a-zA-Z]{2,3}$/i;
	 if( value.match(regExp) != null ){ return true; 
	 }else{ return false}
	
});

//passwordPolicy1
//영문,숫자만  혼용(특수기호 x )
$.validator.addMethod("passwordPolicy1", function(value, element) {
	//패스워드 정책 관련 필터  
	var sp_filter =  /[~!@\#$%<>^&*\()\-=+_\']/gi; //
	var chk_num = value.search(/[0-9]/g);
	var chk_eng = value.search(/[a-z]/ig);
	var chk_sp =value.search(sp_filter);

	if(chk_num <0 || chk_eng <0 || chk_sp > 0){
		return false;
	}else{
		return true;
	}
});

//passwordPolicy2
//영문,숫자,특수문자 혼용(3가지 모두)
$.validator.addMethod("passwordPolicy2", function(value, element) {
	//패스워드 정책 관련 필터  
	var sp_filter =  /[~!@\#$%<>^&*\()\-=+_\']/gi; //
	var chk_num = value.search(/[0-9]/g);
	var chk_eng = value.search(/[a-z]/ig);
	var chk_sp = value.search(sp_filter);
	
	if(chk_num <0 || chk_eng <0 || chk_sp < 0){
		return false;
	}else{
		return true;
	}
});

//passwordPolicy3
//영문,숫자,특수문자 혼용 (2가지 이상)
$.validator.addMethod("passwordPolicy3", function(value, element) {
	//패스워드 정책 관련 필터  
	var sp_filter =  /[~!@\#$%<>^&*\()\-=+_\']/g; //
	var chk_num = value.search(/[0-9]/g);
	var chk_eng = value.search(/[a-zA-Z]/g);
	var chk_sp = value.search(sp_filter);
	
	if((((chk_num >= 0)?1:0)+((chk_eng >=0)?1:0)+((chk_sp >=0)?1:0))  < 3 ){
		return false;
	}else{
		return true;
	}
});

//idPolicy1
//영문,숫자 혼용
$.validator.addMethod("idPolicy1", function(value, element) {
    //아이디 정책 관련 필터  
    if(/^[a-z0-9_]+$/.test(value)) {
        return true;
    }else{
        return false;
    }
});


//isBlank
//공백여부 
$.validator.addMethod("isBlank", function(value, element) {
	var blank_filter = /[\s]/g;
	//alert("isBlank : " +blank_filter.test(value));
	/*if(blank_filter.test(value) == true) return false;
	else return true;*/
	return !blank_filter.test(value);
});

//isHangulOn
//한글만 사용시  
$.validator.addMethod("isHangulOn", function(value, element) {
    var cnt = 0; 
	  for( i=0; i <value.length;i++){
		  c = value.charCodeAt(i);
		  if( 0x1100<=c && c<=0x11FF ) cnt++;
		  if( 0x3130<=c && c<=0x318F ) cnt++;
		  if( 0xAC00<=c && c<=0xD7A3 ) cnt++;
	  }
	  if (cnt > 0 ) return true
	  else return false;
});

//isHangulOff
//한글사용 (X)
$.validator.addMethod("isHangulOff", function(value, element) {
      var cnt = 0;
	  for( i=0; i <value.length;i++){
		  c = value.charCodeAt(i);
		  if( 0x1100<=c && c<=0x11FF ) cnt++;
		  if( 0x3130<=c && c<=0x318F ) cnt++;
		  if( 0xAC00<=c && c<=0xD7A3 ) cnt++;
	  }
	  if (cnt > 0 ) return false
	  else return true;
});

//isSybolOff
//특수기호사용 (X)
$.validator.addMethod("isSybolOff", function(value, element) {
	
	var sp_filter =  /[~!@\#$%<>^&*\()\-=+_\']/gi; //
	var chk_sp =value.search(sp_filter);
	
	if(chk_sp > 0){
		return false;
	}else{
		return true;
	}
	
});


//isRightId
//주민번호 유효성 체크
$.validator.addMethod("isRightId", function(value, element) {
	
	var flag = true;    	    	
	var checkType; //내,외국인 구분
	var regExp = /^[0-9]{13}$/;
	var v_juminNumber ="";
	
	for (var i = 0; i < value.length; i++) {
	    if (value.charAt(i) == '-') {
	        continue;
	    } else {
	    	v_juminNumber += value.charAt(i);
	    }
	}
	
	if (!regExp.test(v_juminNumber)) { //길이체크
	   // alert("주민등록번호는 13자리 숫자만 입력가능합니다.");
	   flag = false;
	} else {
		checkType = v_juminNumber.substring(6,7);
		
		if(checkType == '5' || checkType == '6' || checkType == '7' || checkType == '8') { //외국인 인경우
			var sum = 0;
		    var odd = 0;
		    
		    buf = new Array(13);
		    for (var i = 0; i < 13; i++) buf[i] = parseInt(v_juminNumber.charAt(i));
		    odd = buf[7]*10 + buf[8];
		    if (odd%2 != 0) {
		    	flag =  false;
		    }
		    if ((buf[11] != 6)&&(buf[11] != 7)&&(buf[11] != 8)&&(buf[11] != 9)) {
		    	flag =  false;
		    }
		    multipliers = [2,3,4,5,6,7,8,9,2,3,4,5];
		    for (i = 0, sum = 0; i < 12; i++) sum += (buf[i] *= multipliers[i]);
		    sum=11-(sum%11);
		    if (sum>=10) sum-=10;
		    sum += 2;
		    if (sum>=10) sum-=10;
		    if ( sum != buf[12]) {
		    	flag =  false;
		    } 
		} else { //내국인
			var sum = 0;
	    	var array = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5]; // 주민등록번호 유효성 검사 값
	    	var perNumber;
	    	var checkNum;
			for (var i=0;i<12;i++) { //1~12 번째자리까지만 체크, 마지막 자리는 버림
				sum += v_juminNumber.charAt(i) * array[i];
			}
			perNumber =  sum % 11;
			checkNum = 11 - perNumber;
			if (checkNum > 9) {
				checkNum = checkNum -10;
			}
			if (checkNum != v_juminNumber.charAt(12)) {
				flag = false;
			}
		}
		//if(!flag) alert("주민등록번호를 다시 확인해 주십시오.");
	}
	return flag;
});

//isRightRrno1
//주민번호 유효성 체크 : 필수여부 false
$.validator.addMethod("isRightRrno1", function(value, element) {
	if(value.length == 0) return true;

	var regExp = /^[0-9]{6}$/;
	if (!regExp.test(value)) {
		return false;
	}

	if (value.length !== 6) {
		return false;
	}

	return true;
});

//isRightRrno2
//주민번호 유효성 체크 : 필수여부 false
$.validator.addMethod("isRightRrno2", function(value, element) {
	if(value.length == 0) return true;

	var regExp = /^[0-9]{7}$/;
	if (!regExp.test(value)) {
		return false;
	}

	if (value.length !== 7) {
		return false;
	}

	return true;
});




//isRightBizNo
//사업자번호 유효성 체크
$.validator.addMethod("isRightBizNo", function(value, element) {
	   
	   var bizno = value;
	   //bizno = deleteHyphenStr(bizno);
       var pattern = /(^[0-9]{10}$)/;
       if (!pattern.test(bizno))
       {
       		message = "사업자등록번호를 10자리 숫자로 입력하십시오.";
			return false;
       }
       else
       {
            var sum = 0;
            var at = 0;
            var att = 0;
            var saupjano= bizno;
            sum = (saupjano.charAt(0)*1)+
                  (saupjano.charAt(1)*3)+
                  (saupjano.charAt(2)*7)+
                  (saupjano.charAt(3)*1)+
                  (saupjano.charAt(4)*3)+
                  (saupjano.charAt(5)*7)+
                  (saupjano.charAt(6)*1)+
                  (saupjano.charAt(7)*3)+
                  (saupjano.charAt(8)*5);
            sum += parseInt((saupjano.charAt(8)*5)/10);
            at = sum % 10;
            if (at != 0)
                att = 10 - at;
            if (saupjano.charAt(9) != att)
            {
               return false;
            }
        }
        return true;
	
	
});

//required 수정
$.validator.addMethod("required", function(value, element) {
    
    if(value==null ||value=='undefined'){
        return false;
    }else if(value.trim() == null || value.trim() == ""){
        return false;
    }else{
        return true;
    }
});

// ckRequired
// ckeditor 필수입력 유효성 체크
$.validator.addMethod('ckRequired', function (value, element) {
	if (value == null || value == 'undefined') return false;

	var content = value.replaceAll("&nbsp;", "").trim();

	if (content == '' || content.length == 0) return false;
	else return true;
});

$.validator.addMethod('maxByteLength', function (value, element, param) {
	var byte = 0;

	for(var i=0; i<value.length; i++){
		if(escape(value.charAt(i)).length > 4){
			byte += 2;
		}else{
			byte++;
		}
	}

	return byte <= param;

});

$.validator.addMethod('validPhoneNumber', function(value, element) {
	var cleaned = value.replace(/-/g, '');
	return this.optional(element) || (cleaned.length === 10 || cleaned.length === 11);
}, '유효하지 않은 휴대전화번호 형식입니다.');

$.validator.addMethod('validTelNumber', function(value, element) {
	var phonePattern = /^(02|0[3-9]{1}[0-9]{1})-[0-9]{3,4}-[0-9]{4}$/;
	return this.optional(element) || phonePattern.test(value);
}, "유효하지 않은 전화번호 형식입니다.");

$.validator.addMethod('validBrth', function(value, element) {
	return this.optional(element) || /^\d{4}-\d{2}-\d{2}$/.test(value);
}, "유효하지 않은 생년월일 형식입니다.");

