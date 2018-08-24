var VisionEventRegist = new Object();
VisionEventRegist.func = new Object();
VisionEventRegist.Var = {};
VisionEventRegist.Var.move_scroll_bar = false;

jQuery(window).ready(function(){
    console.log("ready")
	VisionEventRegist.func.ChangeDate( jQuery( '#VER_date_button button.active' ) );

	VisionEventRegist.func.SizeSet();

	/*
	 * スクロールバーのドラッグ可能に
	 */
	var bars = jQuery( '.VER_bar' );
	for( var i = 0; i < bars.length; ++i ) {
		jQuery( bars[i] ).draggable({
			axis : 'x' ,
			containment : jQuery( bars[i] ).closest( '.VER_bar_wrap' ) ,
			drag : function( event , current_info ) { VisionEventRegist.func.DragScroll( current_info ); }
		});
	}

	/*
	 * イベントボックスのスクロール
	 */
	jQuery( '.VER_event' ).on( 'scroll' , function(event) {
		var target = event.currentTarget;
		VisionEventRegist.func.ScrollEventBox( target );
	});


	/*
	 * スクロールバーにイベント登録
	 */
	jQuery( '.VER_arrow' ).on( 'mousedown , touchstart' , function(event) {
		VisionEventRegist.Var.move_scroll_bar = true;
		var target = event.currentTarget;
		VisionEventRegist.func.ArrowScroll( target );
	});


});

/*
 * スクロールバーをドラッグして動かす
 */
VisionEventRegist.func.DragScroll = function( current_info ) {
	VisionEventRegist.Var.move_scroll_bar = true;
	var bar = current_info.helper[0];

	var wrapper = jQuery( bar ).closest( '.VER_scrollbar' ).find( '.VER_bar_wrap' ).get(0);
	var wrapper_width = parseFloat( getComputedStyle( wrapper  , '').getPropertyValue( 'width' ).replace( /px$/ , '' ) );
	wrapper_width = Math.floor( wrapper_width * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );

	var bar_style = jQuery( bar ).get(0);
	var bar_width = parseFloat( getComputedStyle( bar_style  , '').getPropertyValue( 'width' ).replace( /px$/ , '' ) );
	bar_width = Math.floor( bar_width * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );

	var max_left = wrapper_width - bar_width;
	max_left = Math.floor( max_left * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );

	var left = jQuery( current_info.position.left );
	left = left[0];
	if( left >= max_left ) {
		left = max_left;
	} else if( left === undefined ) {
		left = 0;
	}

	var left_per = left / max_left;

	var event_wrap = jQuery( bar ).closest( '.VER_wrapper' ).find( '.VER_event' );

	var event_wrap_width = jQuery( event_wrap ).get(0);
	event_wrap_width = parseFloat( getComputedStyle( event_wrap_width  , '').getPropertyValue( 'width' ).replace( /px$/ , '' ) );
	event_wrap_width = Math.floor( event_wrap_width * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );

	var event_in_location = jQuery( event_wrap ).find( '.event_in_location' ).attr( 'my_width' );

	var max = event_in_location - event_wrap_width;
	max = Math.ceil( max * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );

	var scroll = max * left_per;
	jQuery( event_wrap ).scrollLeft( scroll );

	setTimeout( function(){
		VisionEventRegist.Var.move_scroll_bar = false;
	} , 100 );
}

/*
 * スクロールバーの動作
 */
VisionEventRegist.func.ArrowScroll = function( current ) {
	VisionEventRegist.Var.scroll_id = setInterval( function() {
		VisionEventRegist.func.MoveScrollBar( current );
	} , 30 );

	current.onmouseup = function() {
		clearInterval( VisionEventRegist.Var.scroll_id );
		VisionEventRegist.Var.move_scroll_bar = false;
	}
	current.ontouchend = function() {
		clearInterval( VisionEventRegist.Var.scroll_id );
		VisionEventRegist.Var.move_scroll_bar = false;
	}

}

VisionEventRegist.func.MoveScrollBar = function( current ) {
	/*
	 * スクロールバーを動かす
	 */

	var wrapper = jQuery( current ).closest( '.VER_scrollbar' ).find( '.VER_bar_wrap' ).get(0);
	var wrapper_width = parseFloat( getComputedStyle( wrapper  , '').getPropertyValue( 'width' ).replace( /px$/ , '' ) );
	wrapper_width = Math.floor( wrapper_width * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );

	var bar_element = jQuery( current ).closest( '.VER_scrollbar' ).find( '.VER_bar' );
	var bar_style = jQuery( bar_element ).get(0);
	var bar_width = parseFloat( getComputedStyle( bar_style  , '').getPropertyValue( 'width' ).replace( /px$/ , '' ) );
	bar_width = Math.floor( bar_width * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );

	var max_left = wrapper_width - bar_width;
	max_left = Math.floor( max_left * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );

	var one_per = max_left * 0.01;
	var now_left = jQuery( bar_element ).position().left;
	now_left = Math.floor( now_left * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );
	var direction = jQuery( current ).attr( 'direction' );


	if( direction === 'next' ) {

		if( now_left + one_per >= max_left ) {
			to_left = max_left;
		} else {
			to_left = now_left + one_per;
		}

	} else if( direction === 'back' ) {

		if( now_left - one_per <= 0 ) {
			to_left = 0;
		} else {
			to_left = now_left - one_per;
		}

	}

	jQuery( bar_element ).css( 'left' , to_left + 'px' );

	/*
	 * イベントボックスを連動させる
	 */
	var to_left_per = to_left / max_left;

	var event_wrap = jQuery( current ).closest( '.VER_wrapper' ).find( '.VER_event' );

	var event_wrap_width = jQuery( event_wrap ).get(0);
	event_wrap_width = parseFloat( getComputedStyle( event_wrap_width  , '').getPropertyValue( 'width' ).replace( /px$/ , '' ) );
	event_wrap_width = Math.floor( event_wrap_width * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );

	var event_in_location = jQuery( event_wrap ).find( '.event_in_location' ).attr( 'my_width' );

	var max = event_in_location - event_wrap_width;
	max = Math.ceil( max * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );

	var scroll = max * to_left_per;
	jQuery( event_wrap ).scrollLeft( scroll );

}

/*
 * イベントボックスのスクロール時
 */
VisionEventRegist.func.ScrollEventBox = function( event_wrap ) {
	var left = jQuery( event_wrap ).scrollLeft() * -1;
	jQuery( event_wrap ).closest( '.VER_wrapper' ).find( '.VER_time_table' ).css( 'margin-left' , left + 'px' );

	/*
	 * スクロールバーを連動させる
	 */
	if( ! VisionEventRegist.Var.move_scroll_bar ) {

		var event_wrap_width = jQuery( event_wrap ).get(0);
		event_wrap_width = parseFloat( getComputedStyle( event_wrap_width  , '').getPropertyValue( 'width' ).replace( /px$/ , '' ) );
		event_wrap_width = Math.floor( event_wrap_width * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );

		var event_in_location = jQuery( event_wrap ).find( '.event_in_location' ).get(0);
		event_in_location = parseFloat( getComputedStyle( event_in_location  , '').getPropertyValue( 'width' ).replace( /px$/ , '' ) );
		event_in_location = Math.floor( event_in_location * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );

		var width = event_in_location - event_wrap_width;
		var scroll_per = jQuery( event_wrap ).scrollLeft() / width;

		var bar_wrap = jQuery( event_wrap ).closest( '.VER_wrapper' ).find( '.VER_scrollbar' ).find( '.VER_bar_wrap' ).get(0);

		var bar_wrap_width = parseFloat( getComputedStyle( bar_wrap , '').getPropertyValue( 'width' ).replace( /px$/ , '' ) );
		bar_wrap_width = Math.floor( bar_wrap_width * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );

		var bar_element = jQuery( bar_wrap ).find( '.VER_bar' );
		var bar_style = jQuery( bar_element ).get(0);
		var bar_width = parseFloat( getComputedStyle( bar_style  , '').getPropertyValue( 'width' ).replace( /px$/ , '' ) );
		bar_width = Math.floor( bar_width * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );

		var max = bar_wrap_width - bar_width;
		max = Math.floor( max * Math.pow( 10 , 2 ) ) / Math.pow( 10 , 2 );
		jQuery( bar_element ).css( 'left' , ( max * scroll_per ) + 'px' );
	}
}

/*
 * スクロールバーを隠す
 */
VisionEventRegist.func.SizeSet = function() {
	jQuery( 'html' ).css( 'overflow' , 'hidden' );
	var full_width = jQuery( 'html' ).width();
	var empty_box = jQuery( '<div></div>' , {
		'display' : 'block' ,
		'position' : 'absolute' ,
		'height' : '2000px' ,
		'width' : '300px'
	});
	jQuery( 'body' ).prepend( empty_box );
	jQuery( 'html' ).css( 'overflow' , 'visible' );
	var scroll_width = jQuery( 'html' ).width();

	jQuery( empty_box ).remove();

	var scrollbar_size = full_width - scroll_width;

	if( scrollbar_size > 0 ) {
		var width = jQuery( '.VER_schedule' ).width() + scrollbar_size;
		jQuery( '.VER_schedule_scroll_wrapper' ).width( width );
	}
}

VisionEventRegist.func.ChangeDate = function(obj) {
	jQuery( '#VER_date_button button' ).removeClass( 'active' );
	jQuery( obj ).addClass( 'active' );

	jQuery( '.VER_wrapper' ).hide();
	var target = jQuery( obj ).attr( 'data-target' );
	target = target.replace( /\//g , '\\/' );
	jQuery( '.VER_wrapper[date="' + target + '"]' ).show();
}

VisionEventRegist.func.OpenDetail = function(obj) {
	$('body,.VER_schedule_scroll_wrapper').css({'overflow':"hidden"})
	$('.VER_schedule').css({'-webkit-overflow-scrolling': 'unset'})
	/*var target = jQuery( obj ).attr( 'event_id' );
	var mask = jQuery( '.event_detail_mask[event_id="' + target + '"]' );
	var box = jQuery( '.event_detail_box[event_id="' + target + '"]' );
	var wrapper = jQuery( box ).closest( '.VER_wrapper' );*/
    var date = $(obj).attr('data-date')
	var time = $(obj).attr('data-time')
    var title = $(obj).attr('data-title')
    var location = $(obj).attr('data-location')
    var description = $(obj).attr('data-description')
	var box = jQuery('#event_detail'+date)
	console.log($(obj))
    var mask = jQuery( '#event_mask'+date)
    jQuery('#event_detail'+date+' .time').html('<i class="fas fa-clock" style="padding-right: 5px;"></i>'+time)
    jQuery('#event_detail'+date+' .title').html(title)
    jQuery('#event_detail'+date+' .location').html('<i class="fas fa-map-marker-alt" style="padding-right: 5px"></i>'+location)
    jQuery('#event_detail'+date+' .description').html(description)

	/*var top_position = jQuery( wrapper ).offset().top - jQuery( window ).scrollTop();
	if( top_position <= 30 )
		top_position = 30;
    console.log("open")*/
	jQuery( box ).css({
		'top' : "10%",
		'left' : "15%" ,
		'width' : "70%",
		'height' : "80%"
	});

	jQuery( mask ).fadeIn(250);
	jQuery( box ).fadeIn(250);
}

VisionEventRegist.func.CloseDetail = function(obj) {
	$('body, .VER_schedule_scroll_wrapper').css({'overflow':'auto'})
    $('.VER_schedule').css({'-webkit-overflow-scrolling': 'touch'})
	//var target = jQuery( obj ).attr( 'event_id' );
	//var mask = jQuery( '.event_detail_mask[event_id="' + target + '"]' );
	//var box = jQuery( '.event_detail_box[event_id="' + target + '"]' );
    var box = jQuery('#event_detail'+obj)

    var mask = jQuery( '#event_mask'+obj)
	jQuery( mask ).fadeOut(250);
	jQuery( box ).fadeOut(250);
}
