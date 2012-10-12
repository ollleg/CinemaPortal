var stageWidth = 483;
var stageHeigth = 278; 
var numRows = 10;
var numCols = 21;
var SeatWidth = stageWidth/numCols; 
var zoomSeat = 0.5; 

var seatsPlan=[
['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0'],
['0','0','0','0','0','0','1','1','1','1','1','1','1','1','1','0','0','0','0','0','0'],
['0','0','0','0','1','1','1','1','1','1','1','1','1','1','1','1','1','0','0','0','0'],
['0','0','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','0','0'],
['0','0','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','0','0'],
['0','0','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','0','0'],
['0','0','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','0','0'],
['0','0','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','1','0','0'],
['0','0','0','0','1','1','1','1','1','1','1','1','1','1','1','1','1','0','0','0','0'],
['0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0','0']
]

function getColor(x,y) {
  if(seatsPlan[y-2][x] == '1')
    return '#ffd012';
  else 
    return 'green';
}

var Seat = Class.create();
 
Seat.prototype = {

    initialize : function(mx, my, layer, stage) {
        this.x = mx;
	this.y = my;
        var seat = this;
        
        var trans = null;
        var rect = new Kinetic.Rect({
            x: this.x*SeatWidth,
            y: this.y*SeatWidth,
            width: SeatWidth,
	    height: SeatWidth,
            fill: '#ffd012',
            stroke: 'black',
            opacity: 0.9,
            strokeWidth: 2,
            scale: {
              x: 1,
              y: 1
            },
            startScale: 1
   	});

   rect.on('click', function() {
          seatsPlan[seat.y-2][seat.x] = 2;
          color = getColor(seat.x, seat.y);
          rect.moveToTop();
	  rect.setAttrs({
             fill: color
          });
	  trans = rect.transitionTo({
             duration: 0.5,
	     easing: 'elastic-ease-out',
             x: seat.x*SeatWidth - SeatWidth* (zoomSeat/2),
             y: seat.y*SeatWidth - SeatWidth* (zoomSeat/2),
             scale: {
                x: rect.attrs.startScale * (1 + zoomSeat),
                y: rect.attrs.startScale * (1 + zoomSeat)
             }
          });
	  trans.start();
   });

   rect.on('mouseover', function() {
          color = getColor(seat.x, seat.y);
          rect.moveToTop();
          trans = rect.transitionTo({
             duration: 0.5,
	     easing: 'elastic-ease-out',
             x: seat.x*SeatWidth - SeatWidth* (zoomSeat/2),
             y: seat.y*SeatWidth - SeatWidth* (zoomSeat/2),
             scale: {
                x: rect.attrs.startScale * (1 + zoomSeat),
                y: rect.attrs.startScale * (1 + zoomSeat)
             }
          });
	  trans.start();
	  rect.setAttrs({
             fill: color
          });
   });

   rect.on('mouseout', function() {
        color = getColor(seat.x, seat.y);
        trans = rect.transitionTo({
		duration: 0.5,
        	easing: 'elastic-ease-out',
	     	x: seat.x*SeatWidth,
        	y: seat.y*SeatWidth,
        	scale: {
                   x: rect.attrs.startScale,
                   y: rect.attrs.startScale
        	}
         });
         trans.start();
	 rect.setAttrs({
             fill: color
          });
   });

   layer.add(rect);
  }	
}

window.onload = function() {
    var stage = new Kinetic.Stage({
        container: 'container',
        width: stageWidth,
        height: stageHeigth
    });

    var layer = new Kinetic.Layer();

    createSeats(layer, stage);
    createdisplay(layer, stage);

    stage.add(layer);
};

function createSeats(layer, stage) {
    for(y=0; y<numRows; y++) {
        for(x=0; x<numCols; x++) {
            if( seatsPlan[y][x] != '0' )
                new Seat(x,y+2,layer,stage);
        }
    }
}

function createdisplay(layer, stage) {
    var triangle = new Kinetic.Shape({
        drawFunc: function(context) {
            context.beginPath();
            context.moveTo(SeatWidth*2, SeatWidth*1);
            context.lineTo(SeatWidth*2, SeatWidth*2);
            context.quadraticCurveTo(SeatWidth*10, SeatWidth*1, 
                                     SeatWidth*19, SeatWidth*2);
            context.lineTo(SeatWidth*19, SeatWidth*1);
            context.quadraticCurveTo(SeatWidth*10, SeatWidth*0, 
                                     SeatWidth*2, SeatWidth*1);
            context.closePath();
            this.fill(context);
            this.stroke(context);
        },
        fill: '#00D2FF',
        stroke: 'black',
        strokeWidth: 2,
	shadow: {
        	color: 'black',
        	blur: 10,
        	offset: [5, 5],
        	alpha: 0.5
    	}     
    });

    layer.add(triangle);
}


