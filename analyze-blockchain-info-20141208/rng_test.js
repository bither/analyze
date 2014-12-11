// Import bitcoinjs.js on Blockchain.info 
var fs = require('fs');
eval('' + fs.readFileSync('bitcoinjs.js'));

// Pool size must be a multiple of 4 and greater than 32.
// An array of bytes the size of the pool will be passed to init()
var rng_psize = 256;


var rng_pool = [];

// Forget to initialize this variable 
var rng_pptr;
var rng_state;


var feedData = function(d){
	if(d == undefined){
		d = Math.random() * 255;
		rng_seed_int(d, 16);
	}else{
		// If rng_pptr is not initialized, it can only be undefined or NaN. ARC4 only uses NaN. There can only be 256 possibilities.
		rng_pool[undefined] = d;
		rng_pool[NaN] = d;
	}
}

function rng_seed_int(x, n) {
    if (!n) n = 32;
    for (var i = 0; i <= n-8; i += 8) {
        if (x >> i) rng_pool[rng_pptr++] ^= (x >> i) & 255;
        if (rng_pptr >= rng_psize) rng_pptr -= rng_psize;
    }
}

var next = function(){
	// These lines are commented to simulate the first time a user tempts to use a random number
	// if(!rng_state){
		rng_state = prng_newstate();
		rng_state.init(rng_pool);
	// 	for(rng_pptr = 0; rng_pptr < rng_pool.length; ++rng_pptr)
	// 	    rng_pool[rng_pptr] = 0;
	// 	rng_pptr = 0;
	// }

	var x = new Array(33);
	var i = 0;
	for(i = 0; i < x.length; ++i){
		x[i] = rng_state.next();
	}
	var t = 256&7;
	if(t > 0) x[0] &= ((1<<t)-1); else x[0] = 0;
	return x;
}

var set = [];

// There are only 256 possibile random values.
for(var i = 0; i < 256; i++){
	feedData(i);
	//feedData();
	var x = next();
    
    var randomStr = Crypto.util.bytesToHex(x);
	if(set.indexOf(randomStr) >= 0){
		console.log('repeated random ' + randomStr);
	}else{
		set.push(randomStr);
		console.log('\n random: ' + randomStr);
	}
}

console.log('set size ' + set.length);

