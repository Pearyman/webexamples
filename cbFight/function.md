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

```
function createComparionFunction(propertyName){
	return function(object1,object2){
		var value1=object1(propertyName);
		var value2=object2(propertyName);
		if(value1<value2){
			return -1;
		}else if(value1>value2){
			return 1;
		}else{
			return 0;
		}
	}
}
```

createComparionFunction()就返回了一个匿名函数。返回的函数可能会被赋值给一个变量，或者以其它方式被调用。

不过，在createComparionFunction()函数内部，它是匿名的。在把函数当成值来使用的情况下，都可以使用匿名函数。不过，这并不是匿名函数唯一的用途。



### 7.1 递归

 递归函数是在一个函数通过名字调用自身的情况下构成的

 ```
function factorial(num){
	if(num<=1){
		return 1;
	}else{
		return num*factorial(num-1);
	}
}

 ```

 这是一个经典的阶乘运算函数。虽然这个函数表面上看没什么问题，但下面的代码却可能导致它出错。

 ```
var anotherFactorial=factorial;
factorial=null;
console.log(anotherFactorial(4))
 ```

 以上代码先把factorial()函数保存到变量中，然后将factorial变量设置为null,结果指向原始函数的引用只剩下一个。但是接下来调用anotherFactorial()时候，由于必须执行anotherFactorial，而 factorial这个时候已经不是函数，就会导致错误。这个时候argument.callee可以解决这个问题。

 我们知道，`arguments.callee是一个指向正在执行函数的指针`。因此可以用它来实现对函数的递归调用。

 ```
function factorial(num){
	if(num<=1){
		return num=1;
	}else{
		return num*arguments.callee(num-1);
	}
}

 ```

 加粗的代码显示，通过使用arguments.callee代替函数名，可以确保无论怎样调用函数都不会出问题。因此，在写递归函数时。使用arguments.callee会比使用函数名更保险。

 但是在严格模式下，不能通过脚本访问arguments.callee，访问这个属性会导致错误。 不过，可以使用命名函数表达式来达成相同的结果。

 ```
var factorial=(function f(num){
	if(num<=1){
		return 1;
	}else{
		return num*f(num-1);
	}
	})

 ```

 以上代码创建了一个名为f()的命名函数表达式，然后将它赋值给factorial，即使把函数赋值给另外一个变量， 函数的名字f仍然有效，所以递归调用照样正确的完成。这种方式在严格模式以及非严格模式下都是可以行的通。
