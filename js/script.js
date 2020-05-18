window.addEventListener('load', () => {
	let c = document.getElementById('canvas');

	c.width = 500;
	c.height = 300;

	let gl = c.getContext('webgl') || c.getContext('experimental-webgl');

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);

	// matIVオブジェクトを生成
	var m = new matIV();

	// 各種行列の生成と初期化
	var mMatrix = m.identity(m.create());   // モデル変換行列
	var vMatrix = m.identity(m.create());   // ビュー変換行列
	var pMatrix = m.identity(m.create());   // プロジェクション変換行列
	var mvpMatrix = m.identity(m.create()); // 最終座標変換行列

	// 各行列を掛け合わせる順序を示す一例
	m.multiply(pMatrix, vMatrix, mvpMatrix); // p に v を掛ける
	m.multiply(mvpMatrix, mMatrix, mvpMatrix); // さらに m を掛ける

	console.log(gl);
});

function create_shader(id) {
	let shader;
	let scriptElement = document.getElementById(id);

	if(!scriptElement) return;

	switch(scriptElement.type) {
		case 'x-shader/x-vertex':
			shader = gl.createShader(gl.VERTEX_SHADER);
			break;
		case 'x-shader/x-fragment':
			shader = gl.createShader(gl.FRAGMENT_SHADER);
			break;
		default:
			return;
	}

	gl.shaderSource(shder, scriptElement.text);

	gl.compileShader(shader);

	if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
        return shader;
    }else{
        alert(gl.getShaderInfoLog(shader));
    }
}

function create_program(vs, fs) {
	let program = gl.createProgram();

	gl.attachShader(program, vs);
	gl.attachShader(program, fs);

	gl.linkProgram(program);

	if(gl.getProgramParameter(program, gl.LINK_STATUS)) {
		gl.useProgram(program);
		return program;
	}else {
		alert(gl.getProgramInfoLog(program));
	}
}

function create_vbo(data) {
	let vbo = gl.createBuffer();

	gl.bindBuffer(gl.ARRAY_BUFFER, vbo);

	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);

	gl.bindBuffer(gl.ARRAY_BUFFER, null);

	return vbo;
}