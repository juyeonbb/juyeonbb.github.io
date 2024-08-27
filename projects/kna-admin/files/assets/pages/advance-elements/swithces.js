"use strict";
$(document).ready(function() {
	// Single swithces
  var elemsingle = document.querySelector('.js-single');
  if (elemsingle) {
      var switchery = new Switchery(elemsingle, { color: '#93BE52', jackColor: '#fff' });
  }

  // Single swithces small (22/11/16 JM sm버전을 위해 추가함
  var elemsingleSmallList = document.querySelectorAll('.js-single-small');
  if (elemsingleSmallList.length > 0) {
    for (var i = 0; i < elemsingleSmallList.length; i++) {
      new Switchery(elemsingleSmallList[i], { color: '#93BE52', jackColor: '#fff', size: 'small' });
    }
  }

	// Multiple swithces
	var elem = Array.prototype.slice.call(document.querySelectorAll('.js-switch'));
	elem.forEach(function(html) {
		var switchery = new Switchery(html, { color: '#4680ff', jackColor: '#fff' });
	});

	// Disable enable swithces
	var elemstate = document.querySelector('.js-dynamic-state');
	if (elemstate) {
		var switcheryy = new Switchery(elemstate, { color: '#4680ff', jackColor: '#fff' });

		var disableButton = document.querySelector('.js-dynamic-disable');
		if (disableButton) {
			disableButton.addEventListener('click', function() {
				switcheryy.disable();
			});
		}

		var enableButton = document.querySelector('.js-dynamic-enable');
		if (enableButton) {
			enableButton.addEventListener('click', function() {
				switcheryy.enable();
			});
		}
	}

	// Color Swithces
	// Color switches
	var elemdefault = document.querySelector('.js-default');
	if (elemdefault) {
		var switchery = new Switchery(elemdefault, { color: '#919aa3', jackColor: '#fff' });
	}

	var elemprimary = document.querySelector('.js-primary');
	if (elemprimary) {
		var switchery = new Switchery(elemprimary, { color: '#4680ff', jackColor: '#fff' });
	}

	var elemsuccess = document.querySelector('.js-success');
	if (elemsuccess) {
		var switchery = new Switchery(elemsuccess, { color: '#93BE52', jackColor: '#fff' });
	}

	var eleminfo = document.querySelector('.js-info');
	if (eleminfo) {
		var switchery = new Switchery(eleminfo, { color: '#62d1f3', jackColor: '#fff' });
	}

	var elemwarning = document.querySelector('.js-warning');
	if (elemwarning) {
		var switchery = new Switchery(elemwarning, { color: '#FFB64D', jackColor: '#fff' });
	}

	var elemdanger = document.querySelector('.js-danger');
	if (elemdanger) {
		var switchery = new Switchery(elemdanger, { color: '#FC6180', jackColor: '#fff' });
	}

	var eleminverse = document.querySelector('.js-inverse');
	if (eleminverse) {
		var switchery = new Switchery(eleminverse, { color: '#303548', jackColor: '#fff' });
	}

	// Switch sizes
	var elemlarge = document.querySelector('.js-large');
	if (elemlarge) {
		var switchery = new Switchery(elemlarge, { color: '#4680ff', jackColor: '#fff', size: 'large' });
	}

	var elemmedium = document.querySelector('.js-medium');
	if (elemmedium) {
		var switchery = new Switchery(elemmedium, { color: '#4680ff', jackColor: '#fff', size: 'medium' });
	}

	var elemsmall = document.querySelector('.js-small');
	if (elemsmall) {
		var switchery = new Switchery(elemsmall, { color: '#4680ff', jackColor: '#fff', size: 'small' });
	}

	// var elemdisable = document.querySelector('.js-disable');
	// var switchery = new Switchery(elemdisable, { color: '#1abc9c', jackColor: '#fff', disabled: true });

	// Tags plugins start

	// Color tags
	// var cities = new Bloodhound({
	// 	datumTokenizer: Bloodhound.tokenizers.obj.whitespace('text'),
	// 	queryTokenizer: Bloodhound.tokenizers.whitespace,
	// 	prefetch: 'assets/pages/advance-elements/cities.json'
	// });
	// cities.initialize();

	// var elt = $('.color-tags > input');
	// elt.tagsinput({
	// 	tagClass: function(item) {
	// 		switch (item.continent) {
	// 			case 'Europe'   : return 'label label-primary';
	// 			case 'America'  : return 'label label-danger';
	// 			case 'Australia': return 'label label-success';
	// 			case 'Africa'   : return 'label label-default';
	// 			case 'Asia'     : return 'label label-warning';
	// 		}
	// 	},
	// 	itemValue: 'value',
	// 	itemText: 'text',
	//
	// 	typeaheadjs: [
	// 	{
	// 		hint: true,
	// 		highlight: true,
	// 		minLength: 2
	// 	},
	// 	{
	// 		name: 'cities',
	// 		displayKey: 'text',
	// 		source: cities.ttAdapter()
	// 	}
	// 	]
	// });
	// elt.tagsinput('add', { "value": 1 , "text": "Amsterdam"   , "continent": "Europe"    });
	// elt.tagsinput('add', { "value": 4 , "text": "Washington"  , "continent": "America"   });
	// elt.tagsinput('add', { "value": 7 , "text": "Sydney"      , "continent": "Australia" });
	// elt.tagsinput('add', { "value": 10, "text": "Beijing"     , "continent": "Asia"      });
	// elt.tagsinput('add', { "value": 13, "text": "Cairo"       , "continent": "Africa"    });

// Maximum tags option
// $('.tags_max').tagsinput({
//         maxTags: 3
//     });
//
// // Maximum charcters option
// $('.tags_max_char').tagsinput({
//         maxChars: 8
//     });
//
// // Multiple tags option
// $(".tags_add_multiple").tagsinput('items');
// Tags plugins ends

// Max-length js start

// Default max-length
//     $('input[maxlength]').maxlength();
//
//     // Thresold value
//     $('input.thresold-i').maxlength({
//         threshold: 20
//     });
//
//     //Color class
//     $('input.color-class').maxlength({
//         alwaysShow: true,
//         threshold: 10,
//         warningClass: "label label-success",
//         limitReachedClass: "label label-danger"
//     });
//
//     //Position class
//     $('input.position-class').maxlength({
//         alwaysShow: true,
//         placement: 'top-left'
//     });
//
//     // Textareas max-length
//     $('textarea.max-textarea').maxlength({
//         alwaysShow: true
//     });
// Max-length js ends

});
