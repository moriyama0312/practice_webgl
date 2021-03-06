window.addEventListener('load', () => {
	// canvasエレメントを取得
	let c = document.getElementById('canvas');
	c.width = 500;
	c.height = 300;

	// webglコンテキストを取得
	let gl = c.getContext('webgl') || c.getContext('experimental-webgl');

	// canvasを初期化する色を設定する
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	// canvasを初期化する際の深度を設定する
	gl.clearDepth(1.0);
	// canvasを初期化
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	// 頂点シェーダとフラグメントシェーダの生成
	let v_shader = create_shader('vs');
	let f_shader = create_shader('fs');

	// プログラムオブジェクトの生成とリンク
	let prg = create_program(v_shader, f_shader);

	// attributeLocationを配列に取得
	let attLocation = new Array(2);
	attLocation[0] = gl.getAttribLocation(prg, 'position');
	attLocation[1] = gl.getAttribLocation(prg, 'color');

	// attributeの要素数を配列に格納
	let attStride = new Array(2);
	attStride[0] = 3;
	attStride[1] = 4;

	// モデル(頂点)データ
	let vertex_position = [
		0.0, 1.0, 0.0,
		1.0, 0.0, 0.0,
	   -1.0, 0.0, 0.0
	];

	// 頂点の色情報を格納する配列
	let vertex_color = [
		1.0, 0.0, 0.0, 1.0,
		0.0, 1.0, 0.0, 1.0,
		0.0, 0.0, 1.0, 1.0
	];
	
	// VBOの生成
	let position_vbo = create_vbo(vertex_position);
	let color_vbo = create_vbo(vertex_color);

	// VBOをバインドし登録する(位置情報)
	gl.bindBuffer(gl.ARRAY_BUFFER, position_vbo);
	gl.enableVertexAttribArray(attLocation[0]);
	gl.vertexAttribPointer(attLocation[0], attStride[0], gl.FLOAT, false, 0, 0);

	// VBOをバインドし登録する(色情報)
	gl.bindBuffer(gl.ARRAY_BUFFER, color_vbo);
	gl.enableVertexAttribArray(attLocation[1]);
	gl.vertexAttribPointer(attLocation[1], attStride[1], gl.FLOAT, false, 0, 0);

	// attribute属性を有効にする
	gl.enableVertexAttribArray(attLocation);

	// attribute属性を登録
	gl.vertexAttribPointer(attLocation, attStride, gl.FLOAT, false, 0, 0);
	
	// minMatrix.js を用いた行列関連処理
	// matIVオブジェクトを生成
	var m = new matIV();

	// 各種行列の生成と初期化
	var mMatrix = m.identity(m.create());   // モデル変換行列
	var vMatrix = m.identity(m.create());   // ビュー変換行列
	var pMatrix = m.identity(m.create());   // プロジェクション変換行列
	var mvpMatrix = m.identity(m.create()); // 最終座標変換行列

	// ビュー座標変換行列
	m.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);
	
	// プロジェクション座標変換行列
    m.perspective(90, c.width / c.height, 0.1, 100, pMatrix);

	// 各行列を掛け合わせる順序を示す一例
	m.multiply(pMatrix, vMatrix, mvpMatrix); // p に v を掛ける
	m.multiply(mvpMatrix, mMatrix, mvpMatrix); // さらに m を掛ける

	// uniformLocationの取得
	var uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');
	
	// uniformLocationへ座標変換行列を登録
	gl.uniformMatrix4fv(uniLocation, false, mvpMatrix);
	
	// モデルの描画
	gl.drawArrays(gl.TRIANGLES, 0, 3);
	
	// コンテキストの再描画
	gl.flush();
	
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
	
		gl.shaderSource(shader, scriptElement.text);
	
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
});
