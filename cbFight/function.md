### 7 函数表达式

函数表达式是js中一个即强大也容易令人困惑的特性。定义函数表达式的方式有两种：一种是函数声明，一种是函数表达式。

函数声明的语法是这样的：

```
function functionName(arg0,arg2,arg3){

}

```
首先是function关键字，然后是函数的名字，这就是指定函数名的方式。 浏览器都给函数定义了一个非标准的Name属性，通过这个属性就可以访问到给函数指定的名字。这个属性永远等于跟在function关键字后面的标识符。

```
console.log(functionName.name);

```

关于函数声明，`它的一个重要的特征就是函数声明提升，意思是在执行代码之前就会先读取函数声明`。这就意味着可以把函数声明放在调用它的语句后面。

```
sayHi();
function sayHi(){
	console.log(666);
}
```

这个例子不会抛出错误，因为在代码执行之前就会先读取函数声明。

第二种创建函数的方式是使用函数表达式。函数表达式有几种不同的语法形式。下面是最常见的一种形式。

```
var functionName=function(arg0,arg1,arg2){
	//函数体
}

```

这种形式看起来好像是常规的变量赋值语句，即创建一个函数并将它赋值给变量functionName。这种情况下创建的函数叫做匿名函数。
因为function关键字后面没有标识符。匿名函数的Name是个空字符串。

函数表达式与其它表达式一样，在使用前必须赋值。以下代码会导致错误（感觉这里作者写的不对❎）：

```
sayHi();  //这里依然可以调用啊
var sayHi=function(){
	console.log(666);
}

```

理解函数提升的关键，就是理解函数声明与函数表达式之间的区别。例如，执行以下代码结果可能让人意想不到

```
if(condition){
	function sayHi(){
		console.log('hi');
	}
}else{
	function sayHi(){
		console.log('yo');
	}
}

```

表面上看，以上代码表示在condition为true时，使用一个sayHi()定义；否则，就使用另一个定义。

实际上，这在ECMAScript中属于无效语法，js引擎会尝试修正错误，将其转换为合理的状态。但问题是浏览器尝试修复错误的做法并不一致。

大多数浏览器会返回第二个声明。忽略condition。


可以这样做
```
var sayHi;
if(condition){
	sayHi=function(){
		console.log('hi');
	}
}else{
	sayHi=function(){
		console.log('yo');
	}
}


```
这个例子不会有什么意外，不同的函数会根据condition被赋值给sayHi；
