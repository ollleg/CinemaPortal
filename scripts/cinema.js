/* Cinema plan constants */
var stageWidth = 483;
var stageHeigth = 273; 
var numRows = 8;
var numCols = 21;
var SeatWidth = stageHeigth < stageWidth ? stageWidth/numCols : stageHeigth/numCols; 
var displayOffset = 3*SeatWidth;
var zoomSeat = 0.5; 
var displayColor = '#C6C6C6';

/* Places contstants */
var placeWidth = 20;
var stagePlacesWidth = 483;
var stagePlacesHeigth = 40; 
var rowString = 'Rangee ';
var placesOffset = 80;

/* Seats constants */
var NO = 0; // No seat
var SR = 1; // Seat reserved
var S1 = 2; // Seat of category 1
var S2 = 3; // Seat of category 2
var S3 = 4; // Seat of category 3

var rowsStrings;
var reservedPlacesArray;
var seatsPlan=[
[NO,NO,NO,NO,NO,NO,S1,S1,S1,S1,S1,S1,S1,S1,S1,NO,NO,NO,NO,NO,NO],
[NO,NO,NO,NO,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,NO,NO,NO,NO],
[NO,NO,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,NO,NO],
[NO,NO,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,SR,NO,NO],
[NO,NO,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,S1,NO,NO],
[NO,NO,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,NO,NO],
[NO,NO,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,S2,NO,NO],
[NO,NO,NO,NO,S3,S3,S3,S3,S3,S3,S3,S3,S3,S3,S3,S3,S3,NO,NO,NO,NO]
]

/* Colors constants */
var reservingColor = '#D8D8D8';
var reservedColor = '#D8D8D8';
var s1Color = '#D8D8D8';
var s2Color = '#D8D8D8';
var s3Color = '#D8D8D8';

function getColor(x,y) {
	if( reservedPlacesArray[y][x].isReserved() ) {
		return reservingColor;
	} else {
		if(seatsPlan[y][x] == SR)
			return 'grey';
		else if(seatsPlan[y][x] == S1)
			return '#ffd012';
		else if(seatsPlan[y][x] == S2)
			return 'green';
		else if(seatsPlan[y][x] == S3)
			return 'red';
	}
}

var Seat = Class.create();
 
Seat.prototype = {

    initialize : function(mx, my, layer) {
        this.x = mx;
		this.y = my;
        var seat = this;
		color = getColor(seat.x, seat.y);
        
        var trans = null;
        var rect = new Kinetic.Rect({
            x: this.x*SeatWidth,
            y: this.y*SeatWidth + displayOffset,
            width: SeatWidth-5,
			height: SeatWidth-5,
			cornerRadius: 5,
            fill: color,
            stroke: 'black',
            opacity: 0.9,
            strokeWidth: 1,
            scale: {
				x: 1,
				y: 1
            },
            startScale: 1
   	});

   rect.on('click', function() {
		if (seatsPlan[seat.y][seat.x] != SR) {
			reservedPlacesArray[seat.y][seat.x].setReserved( !reservedPlacesArray[seat.y][seat.x].isReserved() );
			movePlaces();
		}
        color = getColor(seat.x, seat.y);
        rect.moveToTop();
		rect.setAttrs({
            fill: color
        });
		var trans = rect.transitionTo({
            duration: 0.5,
			easing: 'elastic-ease-out',
            x: seat.x*SeatWidth - SeatWidth* (zoomSeat/2),
            y: seat.y*SeatWidth - SeatWidth* (zoomSeat/2) + displayOffset,
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
            y: seat.y*SeatWidth - SeatWidth* (zoomSeat/2) + displayOffset,
            scale: {
                x: rect.attrs.startScale * (1 + zoomSeat),
                y: rect.attrs.startScale * (1 + zoomSeat)
            }
        });
		trans.start();
		rect.setAttrs({
            fill: color
        });
		rect.setShadow({
			color: 'black',
			blur: 5,
			offset: [5, 5],
			alpha: 0.5
		});
   });

   rect.on('mouseout', function() {
        color = getColor(seat.x, seat.y);
        trans = rect.transitionTo({
			duration: 0.5,
        	easing: 'elastic-ease-out',
	     	x: seat.x*SeatWidth,
        	y: seat.y*SeatWidth + displayOffset,
        	scale: {
                x: rect.attrs.startScale,
                y: rect.attrs.startScale
        	}
         });
        trans.start();
		rect.setAttrs({
            fill: color
        });
		rect.setShadow({
			color: 'white',
			blur: 0,
			offset: [0, 0],
			alpha: 1.0
		});
   });

   layer.add(rect);
  }	
}

var Place = Class.create({
	x: 0,
	y: 0,
    initialize : function(mx, my, num, layer) {
        x = mx;
		y = my;
		this.number = num;
		this.reserved = false;
        var place = this;
        
        this.group = new Kinetic.Group({
			x: mx,
            y: my,
			visible: place.reserved
		});
		
        this.rect = new Kinetic.Rect({
            x: 0,
            y: 0,
            width: SeatWidth,
			height: SeatWidth,
			cornerRadius: 5,
            fill: reservingColor,
            stroke: 'black',
            opacity: 0.9,
            strokeWidth: 1,
            scale: {
				x: 1,
				y: 1
            },
            startScale: 1
		});
		
		this.text = new Kinetic.Text({
          x: SeatWidth/4,
          y: SeatWidth/4,
          text: num,
          fontSize: SeatWidth/2,
          fontFamily: "Calibri",
          textFill: "white"
        });

		this.group.add(this.rect);
		this.group.add(this.text);
		layer.add(this.group);
	},
	
	setReserved: function(set) {
		this.reserved = set;
		if (set) {
			this.group.show();
		} else {
			this.group.hide();
		}
	},
	
	move: function(rx, ry) {
	    if (rx != this.group.attrs.x || ry != this.group.attrs.y) {
			trans = this.group.transitionTo({
				duration: 0.5,
				easing: 'elastic-ease-out',
				x: rx,
				y: ry
			});
			trans.start();
		}
	},
	
	isReserved: function() {
		return this.reserved;
	}
});


function createSeats(layer) {
    for(y=0; y<numRows; y++) {
        for(x=0; x<numCols; x++) {
            if( seatsPlan[y][x] != NO )
                new Seat(x,y,layer);
        }
    }
}

function createdisplay(layer) {
    var triangle = new Kinetic.Shape({
        drawFunc: function(context) {
            context.beginPath();
            context.moveTo(SeatWidth*2, SeatWidth*1);
            context.lineTo(SeatWidth*2, SeatWidth*2-SeatWidth/2);
            context.quadraticCurveTo(SeatWidth*numCols/2, SeatWidth*1, 
                                     SeatWidth*(numCols-2), SeatWidth*2 - SeatWidth/2);
            context.lineTo(SeatWidth*(numCols-2), SeatWidth*1);
            context.quadraticCurveTo(SeatWidth*numCols/2, SeatWidth*0+SeatWidth/2, 
                                     SeatWidth*2, SeatWidth*1);
            context.closePath();
            this.fill(context);
            this.stroke(context);
        },
        fill: displayColor,
        stroke: 'black',
        strokeWidth: 1,
		shadow: {
        	color: 'black',
        	blur: 10,
        	offset: [5, 5],
        	alpha: 0.5
    	}     
    });

    layer.add(triangle);
}

function initPlacesArray(rows, cols, layer, stage) {
	var i,j;
	var rcnt = 0;
	reservedPlacesArray = new Array( rows );
	rowsStrings = new Array( rows );
	for (i=0; i<rows; i++) {
		rowsStrings[i] = new Kinetic.Text({
			x: 10,
			y: SeatWidth/2+rcnt*(SeatWidth+5)+5,
			text: rowString+" "+(i+1)+":",
			fontSize: SeatWidth/2,
			fontFamily: "Calibri",
			textFill: "black",
			visible: false
		});
		layer.add(rowsStrings[i]);
		reservedPlacesArray[i] = new Array( cols );
		var xo = 0;
		var xi = 1;
		for (j=0; j<cols; j++) {
			if (seatsPlan[i][j] != NO) {
				reservedPlacesArray[i][j] = new Place(placesOffset + xo, SeatWidth/2+rcnt*(SeatWidth+5), xi++, layer);
				xo += SeatWidth;
			}
		}
		if (xo != 0) {
			rcnt ++;
		}
	}
	stage.setHeight( SeatWidth );
}

function movePlaces() {
	var i,j;
	var rcnt = 0;
	for (i=0; i<reservedPlacesArray.length; i++) {
		var xo = 0;
		var xi = 1;
		for (j=0; j<reservedPlacesArray[i].length; j++) {
			if (seatsPlan[i][j] != NO) {
				if (reservedPlacesArray[i][j].isReserved()) {
					reservedPlacesArray[i][j].move(placesOffset + xo, SeatWidth/2+rcnt*(SeatWidth+5));
					xo += SeatWidth;
				}
			}
		}
		if (xo != 0) {
			rowsStrings[i].setAttrs({
				y: SeatWidth/2+rcnt*(SeatWidth+5)+5
			});
			rowsStrings[i].show();
			rcnt ++;
		} else {
			rowsStrings[i].hide();
		}
	}
	stagePlaces.setHeight( rcnt*(SeatWidth+5) + SeatWidth );
}

window.onload = function() {
    stage = new Kinetic.Stage({
        container: 'container',
        width: stageWidth,
        height: stageHeigth
    });
	
	stagePlaces = new Kinetic.Stage({
        container: 'placesContainer',
        width: stagePlacesWidth,
        height: stagePlacesHeigth
    });

    var layer = new Kinetic.Layer();
	var layerPlaces = new Kinetic.Layer();

	initPlacesArray(numRows, numCols, layerPlaces, stagePlaces);
	
    createSeats(layer);
    createdisplay(layer);

    stage.add(layer);
	stagePlaces.add(layerPlaces);
};




