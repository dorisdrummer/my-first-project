/*--------------------------------
 * @author Wayne Parrott
 * --------------------------------
 */

var options = {
  rotateClass: 'L2R'
};

function config() {
    layout();
    createStars(100);
    startRotate();
}

function layout() {     
     var ht = $(window).height();
     var width = $(window).width(); 
     var newSize = Math.max(width,ht) * 1.5;
     
     $('body').height(ht);
     
     var starContainer = $('#starField');
     $(starContainer).width(newSize);
     $(starContainer).height(newSize);
          
     var foreground = $('#foreground');
     $(foreground).css('top', ht * 0.7);
}

/**
 * @param direction String "L2R" or "R2L"
 */
function startRotate(direction) {
    options.rotateClass = 
        (typeof direction === 'string' && direction === "L2R") ? 'rotateL2R' : 'rotateR2L';
    
    $('#starField').addClass(options.rotateClass);
}

function stopRotate() {
    $('#startField').removeClass(options.rotateClass);
}

function doResize() {
    stopRotate();
    
    //remove all stars and regen
     $('#starField').empty();
     config();
    
}

//----------------------------------------------------------------------------------------
// create stars

function randomIntBetween(a, b) {
    return Math.floor(Math.random()*(b-a+1)+a);
}

function createStars(numStars) {
    var starsContainer = document.getElementById('starField'); 
    var w = starsContainer.clientWidth,
        h = starsContainer.clientHeight-80;
    
    for(i=0; i < numStars; i++) {
        var size = randomIntBetween(1,3),
            x = Math.min(randomIntBetween(1,w), w-size-5),
            y = Math.min(randomIntBetween(1,h), h-size-5);
            
        var elem = document.createElement('div');
        elem.className = "star";
        elem.style.top = y + "px";
        elem.style.left = x + "px"; 
        elem.style.width = size + "px"; 
        elem.style.height = size + "px";
    
        starsContainer.appendChild(elem);        
    }
}

//----------------------------------------------------------------------------------------
//register event handlers
$( window ).resize(doResize);
$(document).ready(config);


/**
 * Hilbert Curve: Generates 2D-Coordinates in a very fast way.
 *
 * @author Dylan Grafmyre
 *
 * Based on work by:
 * @author Thomas Diewald
 * @link http://www.openprocessing.org/visuals/?visualID=15599
 *
 * Based on `examples/canvas_lines_colors.html`:
 * @author OpenShift guest
 * @link https://github.com/mrdoob/three.js/blob/8413a860aa95ed29c79cbb7f857c97d7880d260f/examples/canvas_lines_colors.html
 * @see  Line 149 - 186
 *
 * @param center     Center of Hilbert curve.
 * @param size       Total width of Hilbert curve.
 * @param iterations Number of subdivisions.
 * @param v0         Corner index -X, +Y, -Z.
 * @param v1         Corner index -X, +Y, +Z.
 * @param v2         Corner index -X, -Y, +Z.
 * @param v3         Corner index -X, -Y, -Z.
 * @param v4         Corner index +X, -Y, -Z.
 * @param v5         Corner index +X, -Y, +Z.
 * @param v6         Corner index +X, +Y, +Z.
 * @param v7         Corner index +X, +Y, -Z.
 */
function hilbert3D( center, size, iterations, v0, v1, v2, v3, v4, v5, v6, v7 ) {

	// Default Vars
	var center     = undefined !== center ? center : new THREE.Vector3( 0, 0, 0 ),
		size       = undefined !== size ? size : 10,
		half       = size / 2,
		iterations = undefined !== iterations ? iterations : 1,
		v0 = undefined !== v0 ? v0 : 0,
		v1 = undefined !== v1 ? v1 : 1,
		v2 = undefined !== v2 ? v2 : 2,
		v3 = undefined !== v3 ? v3 : 3,
		v4 = undefined !== v4 ? v4 : 4,
		v5 = undefined !== v5 ? v5 : 5,
		v6 = undefined !== v6 ? v6 : 6,
		v7 = undefined !== v7 ? v7 : 7
	;

	var vec_s = [
		new THREE.Vector3( center.x - half, center.y + half, center.z - half ),
		new THREE.Vector3( center.x - half, center.y + half, center.z + half ),
		new THREE.Vector3( center.x - half, center.y - half, center.z + half ),
		new THREE.Vector3( center.x - half, center.y - half, center.z - half ),
		new THREE.Vector3( center.x + half, center.y - half, center.z - half ),
		new THREE.Vector3( center.x + half, center.y - half, center.z + half ),
		new THREE.Vector3( center.x + half, center.y + half, center.z + half ),
		new THREE.Vector3( center.x + half, center.y + half, center.z - half )
	];

	var vec = [
		vec_s[ v0 ],
		vec_s[ v1 ],
		vec_s[ v2 ],
		vec_s[ v3 ],
		vec_s[ v4 ],
		vec_s[ v5 ],
		vec_s[ v6 ],
		vec_s[ v7 ]
	];

	// Recurse iterations
	if ( -- iterations >= 0 ) {

		var tmp = [];

		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 0 ], half, iterations, v0, v3, v4, v7, v6, v5, v2, v1 ) );
		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 1 ], half, iterations, v0, v7, v6, v1, v2, v5, v4, v3 ) );
		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 2 ], half, iterations, v0, v7, v6, v1, v2, v5, v4, v3 ) );
		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 3 ], half, iterations, v2, v3, v0, v1, v6, v7, v4, v5 ) );
		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 4 ], half, iterations, v2, v3, v0, v1, v6, v7, v4, v5 ) );
		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 5 ], half, iterations, v4, v3, v2, v5, v6, v1, v0, v7 ) );
		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 6 ], half, iterations, v4, v3, v2, v5, v6, v1, v0, v7 ) );
		Array.prototype.push.apply( tmp, hilbert3D ( vec[ 7 ], half, iterations, v6, v5, v2, v1, v0, v3, v4, v7 ) );

		// Return recursive call
		return tmp;

	}

	// Return complete Hilbert Curve.
	return vec;

}

/**
 * @author mrdoob / http://mrdoob.com
 * Based on @tojiro's vr-samples-utils.js
 */

var WEBVR = {

	isLatestAvailable: function () {

		console.warn( 'WEBVR: isLatestAvailable() is being deprecated. Use .isAvailable() instead.' );
		return this.isAvailable();

	},

	isAvailable: function () {

		return navigator.getVRDisplays !== undefined;

	},

	getMessage: function () {

		var message;

		if ( navigator.getVRDisplays ) {

			navigator.getVRDisplays().then( function ( displays ) {

				if ( displays.length === 0 ) message = 'WebVR supported, but no VRDisplays found.';

			} );

		} else {

			message = 'Your browser does not support WebVR. See <a href="http://webvr.info">webvr.info</a> for assistance.';

		}

		if ( message !== undefined ) {

			var container = document.createElement( 'div' );
			container.style.position = 'absolute';
			container.style.left = '0';
			container.style.top = '0';
			container.style.right = '0';
			container.style.zIndex = '999';
			container.align = 'center';

			var error = document.createElement( 'div' );
			error.style.fontFamily = 'sans-serif';
			error.style.fontSize = '16px';
			error.style.fontStyle = 'normal';
			error.style.lineHeight = '26px';
			error.style.backgroundColor = '#fff';
			error.style.color = '#000';
			error.style.padding = '10px 20px';
			error.style.margin = '50px';
			error.style.display = 'inline-block';
			error.innerHTML = message;
			container.appendChild( error );

			return container;

		}

	},

	getButton: function ( effect ) {

		var button = document.createElement( 'button' );
		button.style.position = 'absolute';
		button.style.left = 'calc(50% - 50px)';
		button.style.bottom = '20px';
		button.style.width = '100px';
		button.style.border = '0';
		button.style.padding = '8px';
		button.style.cursor = 'pointer';
		button.style.backgroundColor = '#000';
		button.style.color = '#fff';
		button.style.fontFamily = 'sans-serif';
		button.style.fontSize = '13px';
		button.style.fontStyle = 'normal';
		button.style.textAlign = 'center';
		button.style.zIndex = '999';
		button.textContent = 'ENTER VR';
		button.onclick = function() {

			effect.isPresenting ? effect.exitPresent() : effect.requestPresent();

		};

		window.addEventListener( 'vrdisplaypresentchange', function ( event ) {

			button.textContent = effect.isPresenting ? 'EXIT VR' : 'ENTER VR';

		}, false );

		return button;

	}

};// OPTIONS
var maxplanetspeed = 10;
var minplanetspeed = 10;
var minplanetradius = 2;
var maxplanetradius = 6;
var gravity = .5;
var numplanets = 9;
var mainplanetradius = 20;
var maxtrail = 10;
var infinitetrail = false;


//FPS VARIABLES
var fps = 0, now, lastUpdate = (new Date)*1 - 1;
var fpsOut = document.getElementById('fps');
var last;
var t;

//CANVAS
var canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = 400;
var context = canvas.getContext("2d");
var canvasW = canvas.width;
var canvasH = canvas.height;
var screencap = context.getImageData(0, 0, canvasW, canvasH);

var center = [window.innerWidth/2,200];
var interval;
var intervalfps = 1000/60;
var planets = [];

function Planet(x,y,s,radius)
{
  this.x = x;
  this.y = y;
  this.s = s;
  this.vx = Math.random() * s;
  this.vy = Math.random() * s;
  this.r = 0;
  this.g = 0;
  this.b = 0;
  this.a = 250;
  this.radius = radius;
  this.tochange = false;
  this.infront = true;
  this.trail = [];
}

function init(){
  planets = [];
  for(var i = 0; i < numplanets; i++)
  {
    var p = new Planet (Math.random() * canvasW, Math.random() * canvasH,minplanetspeed + Math.random() * (maxplanetspeed - minplanetspeed),minplanetradius + Math.random() * (maxplanetradius - minplanetradius));
    planets.push(p);
  }
}


var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function intervalhandler(){
  
  var thisFrameFPS = 1000 / ((now=new Date) - lastUpdate);
  fps += (thisFrameFPS - fps) / intervalfps;
  lastUpdate = now;
  fpsOut.innerHTML = fps.toFixed(1) + "fps";
  
  context.putImageData(screencap, 0, 0);
  
  for(var i = 0; i < planets.length; i++)
  {
    var p = planets[i];
    for(var t = 0; t < p.trail.length; t++)
    {
      var tr = p.trail[t];
      var a;
      if(!infinitetrail) a = .8 - (t * 1/maxtrail);
      else a = 1;
      drawPlanet(tr[0],tr[1],tr[2],a);
    }
    drawPlanet(p.x,p.y,p.radius,1);
    var dx = center[0] - p.x;
    var dy = center[1] - p.y;
    var angle = Math.atan2(dx,dy);
    var dist = Math.sqrt(dx * dx + dy * dy);
    if(dist <= mainplanetradius + p.radius && !p.tochange)
    {
      p.tochange = true;
    }
    else if(dist > mainplanetradius && p.tochange)
    {
      tochange = false;
      p.infront ^= true;
    }
    var movex = dx / dist;
    var movey = dy / dist;
    p.vx += movex * gravity;
    p.vy += movey * gravity;
    if(Math.sqrt(p.vx * p.vx + p.vy * p.vy) > p.s)
    {
      var ratio = p.s/Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      p.vx *= ratio;
      p.vy *= ratio; 
    }
    p.x += p.vx;
    p.y += p.vy;
    p.lastvx = p.vx;
    if((p.trail.length < maxtrail) || infinitetrail)
    {
      p.trail.unshift([p.x,p.y,1.5]);
    }
    else
    {
      if(p.trail.length > maxtrail + 1) p.trail = [];
      else p.trail.pop();
    }
  }
  
  drawPlanet(center[0],center[1],mainplanetradius,1);
  requestAnimationFrame(intervalhandler);
}