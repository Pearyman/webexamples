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


 ### 7.2 闭包

 有不少开发人员总是搞不清匿名函数和闭包这两个概念，因此经常混用。闭包是指有权访问另一个函数作用域的变量的函数。 创建闭包的常见方式，就是在一个函数内部创建另一个函数，仍以前面的函数为例。


 ```
function createComparionFunction(propertyName){
	return function(object1, object2){
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

 在这两个例子中，突出的那两行代码，这两行代码访问了外部的函数变量propertyName。即使这个内部函数被返回了，而且是在其他地方被调用了，但它仍然可以访问变量propertyName。之所以能够访问这个变量，是因为内部函数的作用域链中包含createComparionFunction()的作用域。

 第四章介绍了作用域链的概念。而有关如何创建作用域链以及作用域链有什么作用的细节，对彻底理解闭包至关重要。当某个函数被调用时，会创建一个执行环境以及相应的作用域链。然后，使用arguments和其他命名参数的值来初始化函数的活动对象。但在作用域链中，外部函数的活动对象始终处于第二位，外部函数的外部函数的活动对象处于第三位，....直至作为作用域链终点的全局执行环境。

 在函数执行过程中，为读取和写入变量的值，就需要在作用域链中查找变量。

 ```
function compare(value1,value2){
	if(value1<value2){
		return -1;
	}else if(value1>value2){
		return 1;
	}else {
		return 0;
	}
}

var result=compare(5,10);
 ```

 定义了一个compare函数，然后又在全局作用域中调用它。当调用compare()时，会创建一个包含arguments、value1、和value2的活动对象。全局执行环境的变量对象（包含result 和 compare） 在compare()执行环境作用域链的处于第二位的。


 后台每个执行环境都有一个表示变量的对象---变量对象。全局环境的变量对象始终存在，而像compare()函数这样的局部环境的变量对象，则只在函数执行的过程中存在。在创建compare()函数时，会创建一个预先包含全局变量对象的作用域链。 这个作用域链被保存在内部的属性中。

 当调用compare()函数时，会为函数创建一个执行环境，然后通过复制函数的属性中的对象构建起执行环境的作用域链。此后，又有一个活动对象被创建并被推入执行环境作用域链的前端。对于这个例子中compare()函数执行环境而言，其作用域链包含两个变量对象 本地活动对象和全局变量对象。显然，作用域本质上是一个指向变量对象的指针列表，它只引用但不实际包含变量对象。

 无论什么时候在函数中访问一个变量时，就会从作用域链中搜索具有相应名字的变量。一般来讲，当函数执行完毕后，局部活动对象就会被销毁，内存中仅保存全局作用域。但是闭包的情况又有所不同。

 在另一个函数内部定义的函数会将外部函数的活动对象添加到它的作用域中。因此，在createComparionFunction()函数内部定义的匿名函数的作用域链中，实际上将会包含外部函数createComparionFunction()的活动对象。

 ```
var compare=createComparionFunction('name');
var result= compare({name:'ada'},{name,'adas'});

 ```
在匿名函数从createComparionFunction()中被返回后，它的作用域链被初始化为包含createComparionFunction()函数的活动对象和全局变量对象。
```
var compare=createComparionFunction('name');
var result= compare({name:'ada'},{name,'adas'});

compare=null; //解除对匿名函数的引用，释放内存

```
首先创建的比较函数被保存在变量compare中。而通过compare设置为等于Null解除该函数的引用，就等于通过垃圾回收将其清除。随着匿名函数的作用域被销毁，其他作用域也都可以完全的销毁了。


注意：

由于闭包会携带包含它的函数的作用域，因此会比其他函数占用更多的饿内存。过度使用闭包可能会导致内存占用过多，我们建议读者只是在绝对必要时在考虑使用闭包。虽然V8等优化后的js引擎尝试回收被闭包占用的内存，但还是要慎重的使用闭包。




### 7.2.1闭包与变量

作用域链的这种配置机制引出了一个值得注意的副作用，即闭包只能取得包含函数中任何变量的最后一个值。别忘了闭包所保存的是整个变量对象，而不是某个特殊的变量。

```
function createFunctions(){
	var result=new Array();
	for(var i=0; i<10; i++){
		result[i]=function(){
			return i;
		}
	}
	return result;
}

```

这个函数会返回一个函数数组，表面上看，似乎每个函数都应该返回自己的索引值。即位置0的函数返回0，位置1的函数返回1，以此类推。但实际上，每个函数都返回的是10.因为每个函数的作用域链中都保存着createFunctions的活动对象，所以他们引用的都是同一个变量i, 当createFunctions函数返回后，变量i的值是10，此时每个函数都引用着保存变量i 的同一个变量对象，所以在每个函数内部i的值都是10.但是，我们可以通过创建另一个匿名函数强制让闭包的行为符合预期。

```
function createFunctions(){

	var result=new Array();
	for(var i=0; i<10;i++){
		result[i]=function (num){
			return function(){
				return num;
			}
		}(i)
	}
	return result;
}

//说实话  我觉得这个的操作性不强 不是很好的例子

```

在重写了前面的createFunctions函数后，每个函数就会返回各自不同的索引值了。在这个版本中，我们没有直接把闭包赋值给数组，而是定义了一个匿名函数，并将立即执行改匿名函数的结果赋值给数组。这里的匿名函数有一个参数num，也就是最终的函数要返回的值。在调用每个匿名函数时，我们传入了变量i。由于函数参数是按值传递的，所以就会将变量i的当前值复制给参数Num.而在这个匿名函数内部，又创建并返回了一个访问Num的闭包。这样一来，result数组中的每个函数都有自己num变量的一个副本，因此就返回来各自不同的值了。


### 7.2.2 关于this对象

在闭包中使用this对象也可能会导致一些问题。我们知道，this对象是在运行时基于函数的执行环境绑定的； 在全局函数中，this等于window。而当函数被作为某个对象的方法调用时，this等于那个对象。不过，匿名函数的执行环境具有全局性。因此this对象通常指向window。但有时候由于编写闭包的方式不同，这一点可能不会那么明显。


```
var name='this window';

var object={
	name:'my object',
	getNameFunc:function(){
		return function(){
			return this.name;
		}
	}
}

console.log(object.getNameFunc()());  // this window
```
以上代码创建了一个全局变量name，又创建了一个包含name属性的对象。这个对象还包含一个方法---getNameFunc();它返回一个匿名函数，而匿名函数又返回this.name。由于getNameFunc()返回一个函数，因此调用object.getNameFunc()()就会立即调用它返回的函数。结果就是返回一个字符串。

然而这个例子返回的是 this window，即全局Name变量的值。为什么匿名函数没有取得其包含作用域的this对象呢？

前面提到过，每个函数再被调用时都会自动取得两个特殊变量：this和arguments。 内部函数在搜索这两个变量时，只会搜索到其活动变量为止，因此永远不可能直接访问函数中的这两个变量。不过，把外部作用域中的this对象保存在一个闭包能够访问到的变量里，那可以让闭包访问该对象了。


```
var name='the window';

var object={
	name:'the object',
	getNameFunc:function(){
		var that=this;
		return function(){
			return that.name;
		}
	}
}
console.log(object.getNameFunc()());  //the object

```


代码中突出展示； 这个例子和上一个例子的不同之处。在定义匿名函数之前，我们把this对象赋值给了一个名叫that的变量。而在定义了闭包之后，闭包也可以访问这个变量。因为它是我们在包含函数中特意声明的一个变量。即使在函数返回之后，that也仍然引用着object，所以调用object.getNameFunc()()就返回了'the object';

this和arguments也存在同样的问题。如果想访问作用域中的arguments对象，必须将对该对象的引用保存到另一个闭包能够访问的变量中。

在几种特殊的情况下，this的值可能会发生意外的改变。比如，下面的diamante是修改前面例子的结果。

```
var name='the window';
var object={
	name:'the object',
	getName:function(){
		return this.name;
	}
}

```
这里的getName()方法只简单的返回this.name的值。以下是几种调用object.getName()的方式以及各自的结果。

```
object.getName(); // the object
(object.getName)();  //the object
(object.getName=object.getName)();  //the window

```

第一个代码跟平常的一样调用了object.getName()，返回的是the object,因为thie.name就是object.name。第二行代码在调用这个方法前给它加上了括号。虽然加上括号之后，就好像只是在引用一个函数，但是this的值得到了维持，因为object.getName和（object.getName）的定义是相同的。第三行代码先执行了一个赋值语句，然后在调用赋值后的结果。因为这个赋值表达式的值是函数本身的，所以this得值不能得到维持。结果就返回了the window。

当然，你不大可能会像第二行和第三行代码一样调用这个方法。不过，这个例子有助于说明即使是语法的细微变化，都有可意外的改变this的值。


### 7.2.3 内存泄漏
