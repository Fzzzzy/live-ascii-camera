;var grid = (function(win, doc, undefined) {
    "use strict";

   	var append, query, createDom, is, deepCopy;


   	/*---------------------辅助函数 Start----------------------------*/
    append = function(parentNode, childNode) {
    	if (typeof childNode === "string") {
    		var previousHTML = parentNode.innerHTML;
    		return parentNode.innerHTML = previousHTML + childNode;
    	} else {
    		return parentNode.appendChild(childNode);
    	}
    }

    query = function(string, parentNode) {
        if (parentNode) {
            return parentNode.querySelector(string);
        } else {
            return doc.querySelector(string);
        }
    }

    createDom = function(tagName) {
        return document.createElement(tagName);
    }

    is = function(obj, type) {
        var toString = Object.prototype.toString;
        return (type === 'Null' && obj == null) ||
            (type == "Undefined" && Object === undefined) ||
            toString.call(obj).slice(8, -1) === type;
    }

    deepCopy = function(oldObj, newObj) {
        for (var key in oldObj) {
            var copy = oldObj[key];
            if (oldObj === copy) continue; //如window.window === window，会陷入死循环，需要处理一下
            if (is(copy, "Object")) {
                newObj[key] = deepCopy(copy, newObj[key] || {});
            } else if (is(copy, "Array")) {
                newObj[key] = []
                newObj[key] = deepCopy(copy, newObj[key] || []);
            } else {
                newObj[key] = copy;
            }
        }
        return newObj;
    }

   	/*---------------------辅助函数 End----------------------------*/

    var _asciiDom,
    	_cells,
    	characters,
    	canvasWidth, canvasHeight;


    _asciiDom = query("#ascii");
    _cells = [];
    characters = (" .,:;i1tfLCG08@").split("");

    function initial(width, height) {
    	canvasWidth = width;
    	canvasHeight = height;
    	for (var y = 0; y < height; y++) {
    		var row;
    		row = new Row({seqNum: y});
    		_cells[y] = [];
    		for (var x = 0; x < width; x++) {
    			var cell;
    			cell = new Cell({
    				rowSeqNum: y,
    				seqNum: x
    			}, row.rowDom);
    		}
    	}
    }

    function blackAll() {
    	for (var i = 0, len1 = _cells.length; i < len1; i++) {
    		for (var j = 0, len2 = _cells[i].length; j < len2; j++) {
    			_cells[i][j].cellDom.style.color = "#000";
    		}
    	}
    }
    
    function operArr(asciiStr) {
    	for (var i = 0, len = asciiStr.length; i < len; i++) {
    		try {
	    		var asciiNumber = asciiStr.charCodeAt(i);
	    		var y = Math.floor(i / (Math.floor(canvasWidth / 2)));
	    		var x = Math.floor(i % (Math.floor(canvasWidth / 2)));
	    		var f1 = Math.floor(asciiNumber % 16);
	    		var f2 = Math.floor(asciiNumber / 16);
	    		var cell1 = _cells[y][x*2];
	    		var cell2 = _cells[y][x*2+1];
	    		if (cell1.isNeedChange(f1)) {
	    			cell1.changeWord(f1);
	    		}
	    		if (cell2.isNeedChange(f2)) {
	    			cell2.changeWord(f2);
	    		}
	    	} catch(e) {
	    		console.log(e);
	    	}
    	}
    }

    function judgeNeedChange(y, x, index) {
    	return _cells[y][x].isNeedChange(index);
    }


    var Row = (function() {
        var Row;

        function _getRowDom(row) {
        	var dom = createDom("div");
        	dom.id = "row-" + row.seqNum;
            append(_asciiDom, dom);
            return dom;
        }

        function Row(options) {
            deepCopy(options, this);
            this.init();
        }

        Row.prototype = {
            init: function() {
                this.initRowDom();
            },

            initRowDom: function() {
                this.rowDom = _getRowDom(this);
            }
        }

        return Row;
    })();


    var Cell = (function() {
        var Cell;

        function _getCellDom(cell, rowDom) {
        	var dom = createDom("span");
        	dom.id = "cell-" + cell.rowSeqNum + "-" + cell.seqNum;
        	dom.innerHTML = "@";
            append(rowDom, dom);
            return dom;
        }

        function Cell(options, rowDom) {
            deepCopy(options, this);
            this.init(rowDom);
            _cells[this.rowSeqNum].push(this);
        }

        Cell.prototype = {
            init: function(rowDom) {
                this.initCellDom(rowDom);
                this.initConfig();
            },

            initCellDom: function(rowDom) {
                this.cellDom = _getCellDom(this, rowDom);
            },

            initConfig: function() {
            	this.index = 16;
            },

            changeWord: function(index) {
            	var changeColor = (Math.abs(index - this.index)) > 6;
            	this.index = index;
            	this.cellDom.innerHTML = characters[index];
            	if (changeColor) {
            		this.cellDom.innerHTML = "@";
            		this.cellDom.style.color = "#CE0000";
            	} else {
            		this.cellDom.style.color = "#000";
            	}
            	
            },

            isNeedChange: function(index) {
            	return (this.index !== index);
            }
        }

        return Cell;
    })();

    return {
        initial: initial,
        operArr: operArr,
        judgeNeedChange: judgeNeedChange,
        blackAll: blackAll
    };

})(window, document);

var testhehe = function() {
	//grid.initial(160, 60);
	var arr = [];
	var count = 1000;
	while (count--) {
		var y = Math.floor(Math.random() * 60);
		var x = Math.floor(Math.random() * 160);
		var index = Math.floor(Math.random() * 15);
		arr.push({
			x:x,
			y:y,
			index:index
		});
	}
	grid.operArr(arr);
	setTimeout(testhehe, 1000);
}