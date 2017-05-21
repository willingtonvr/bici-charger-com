(function() {
    function NumberToArrayBuffer() {
        // Create 1 entry long Float64 array
        return new Float32Array([this.valueOf()]).buffer;
    }
    function NumberFromArrayBuffer(buffer) {
        // Off course, the buffer must be ar least 8 bytes long, otherwise this is a parse error
        return new Float32Array(buffer, 0, 1)[0];
    }
    if(Number.prototype.toArrayBuffer)  {
        console.warn("Overriding existing Number.prototype.toArrayBuffer - this can mean framework conflict, new WEB API conflict or double inclusion.");
    }
    Number.prototype.toArrayBuffer = NumberToArrayBuffer;
    Number.fromArrayBuffer = NumberFromArrayBuffer;
    // Hide this methods from for-in loops
    Object.defineProperty(Number.prototype, "toArrayBuffer", {enumerable: false});
    Object.defineProperty(Number, "fromArrayBuffer", {enumerable: false});
})();

//console.log("Individual bytes of a Number: ",new Uint4Array((666).toArrayBuffer(),0,8));
var buffer = new ArrayBuffer(4);


var dv = new DataView(buffer,0,4)
buffer[0] = 64
buffer[1] = 150
buffer[2] = 237
buffer[3] = 187
console.log('buffer')
console.log(buffer)
console.log('int buff')
console.log(new Uint8Array(buffer,0,4))
var floatView= new Float32Array(buffer,0,1)
//dv.setFloat32(0,4.71652)
dv.setUint8(0,64)
dv.setUint8(1,150)
dv.setUint8(2,237)
dv.setUint8(3,187)
console.log("Con FloatView :" + floatView[0].toFixed(6))

console.log("Con dataview :" + dv.getFloat32(0))
var fl32 = dv.getFloat32(0)
console.log("formatiado :" +fl32.toFixed(6))
cvrt(buffer)

console.log("Individual bytes of a Number: ",new Uint8Array((4.71652).toArrayBuffer(),0,4));

function cvrt(buffer){

  console.log("CVRT: ", Number.fromArrayBuffer(buffer));


}
