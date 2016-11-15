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


由于ie9之前的版本对JScript和COM对象使用不同的垃圾收集例程。

因此闭包IE的这些版本中会导致一些特殊的问题。具体来说，如果闭包的作用域链中保存一个HTML元素，那么就意味着该元素无法销毁。

```
function assignHandler(){
	var element=document.getElementById('someElement');
	element.onclick=function(){
		console.log(element.id);
	}
}

```

以上代码创建了一个作为element元素事件处理程序的闭包，而这个闭包则又创建了一个循环引用。由于匿名函数保存了一个对assignHandler()的活动对象的引用，因此就会导致无法减少element的引用数。只要匿名函数存在，element的引用数至少也是1，因此他所占用的内存永远都不会回收，不过，这个问题可以通过稍微改写一下代码来解决。


```
function assignHandler(){
	var element=document.getElementById('someElement');
	var id=element.id;
	element.onclick=function(){
		console.log(id);
	}
	element=null;
}

```

在上面的代码中，通过把element.id的一个副本保存在一个变量中，并且在闭包中引用该变量消除了循环引用。但仅仅做到这一步，还是不能解决内存泄漏的问题。必须要记住：闭包会引用包含函数的整个的活动对象，而其中包含着element。即使闭包不直接引用element，包含函数的活动对象中也仍然会保存一个引用。因此，有必要把element变量设置为Null,这样就能够消除DOM对象的引用。顺利的减少其引用数，确保正常回收其占用的内存。


### 7.3 模仿块级作用域

JS中没有块级作用域的概念。这意味着在块语句中定义的变量，实际上是在包含函数中而非语句中创建的。

```
function outputNumbers(){
	for(var i=0; i<count; i++){
		console.log(i);
	}
	console.log(i);
}

```

这个函数定义了一个for循环，而变量i的初始值设置为0.在java和c++中，变量i只会在for循环的语句块中定义，循环一旦结束，变量i就会销毁。可是在js中，变量i是定义在outputNumbers()活动对象中的，因此从它有定义开始，就可以在函数内部随处访问它。即使像下面这样错误的重新声明一个变量，也不会改变它的值。

```
function outputNumbers(){
	for(var i=0; i<count; i++){
		console.log(i);

	}
	var i;
	console.log(i);
}


```
js从来不会告诉你是否多次声明了同一个变量；遇到这种情况，它只会对后续的声明视而不见。匿名函数可以用来模仿块级作用域并避免这个问题。
用作块级作用域的匿名函数语法如下所示:

```
(function(){
	//这里是块级作用域
	})()

```

以上代码定义并立即调用了一个匿名函数。将函数声明包含在一对圆括号中，表示它实际上是一个函数表达式。而紧随其后的另一对括号会立即调用这个函数。如果有读者感觉这种语法不太好理解，可以看看下面这个例子。

```
var count=5;
outputNumbers(5);

```

这里初始化了变量count，将其值设置为5.当然，这里的变量是没有必要的。因为可以把值直接传给函数。为了让代码更简洁，我们在调用时可以更简洁。

```
outputNumbers(5);
```

这样做之所以可行，是因为变量只不过是值的另外一种表达形式。因此用实际的值替换变量没有问题。再看下面的例子

```
var someFunction=function(){
	//这是块作用域
}
someFunction();

```
这个例子先创建了一个函数，然后立即调用它。定义函数的方式是创建一个匿名函数，并把它匿名函数赋值给变量someFunction。而调用这个函数就是在函数名称后面加一个括号，即someFunction(); 通过前面的例子我们知道，可以使用实际的值来取代变量count,那在这里是不是也可以用函数的值来直接取代函数名呢？然而下面的代码会导致错误。

```
function(){
//这里是块级作用域
}();

```

这段代码会导致语法错误，是因为Js将function关键字当做一个函数声明开始，而函数声明后面不能再跟圆括号。然后，函数表达式的后面是可以跟圆括号的。要将函数声明转换为函数表达式，只要像下面这样加上一个圆括号就可以了。



```
(function(){
//这里是块级作用域
	})()

```

无论在什么地方，只要临时需要一些变量，就可以使用私有作用域。例如：

```
function outputNumbers(count){
	(function(){
		for(var i=0; i<count;i++){
			console.log(i);
		}
		});
		console.log(i);
}

```

在这个重写后的outputNumbers()函数中，我们在for循环外部插入了一个私有作用域。在匿名函数中定义的任何变量，都会在执行结束时被销毁。因此，变量i只能在循环中使用，使用后即被销毁。而在私有作用域中能够访问变量count,是因为这个匿名函数是一个闭包。它能够访问包含作用域中的所有变量。

这种技术通常在全局作用域中被用在函数外部，从而限制向全局作用域中添加过多的变量和函数。一般来说，我们都应该尽量少向全局作用域中添加变量和函数。在一个由很多开发人员共同参与的大型应用程序中，过多的全局变量和函数很容易引起导致命名冲突。而通过创建私有作用域，每个开发人员即可以使用自己的变量，又不必担心搞乱全局作用域。


```
(function(){
	var now=new Date();
	if(now.getMonth()==0 && now.getDate()==1){
		alert('happy new year');
	}
	})()


```
把上面这段代码放在全局作用域中，可以用来确定哪一天是1月1号。如果到了这一天，就会向用户显示一条新年祝福。其中的Now现在是匿名函数的局部变量，而我们不必在全局作用域中创建他。

注意：

这种做法可以减少闭包占用的内存问题，因为没有指向匿名函数的引用。只要匿名函数执行完毕，就可以立即销毁其作用域链了。


### 7.4 私有变量

严格来讲Js中是没有私有成员的概念；所有对象属性都是公有的。不过，倒是有一个私有变量的饿概念。任何在函数中的变量，都可以认为是私有变量。因为不能在函数的外部访问这些变量。私有变量包括函数的参数、局部变量和在函数内部定义的其它该函数。


```
function add(num1,num2){
	var sum=num1+num2;
	return sum;
}

```
在这个函数内部，有3个私有变量：num1,num2,sum。在函数内部可以访问这几个变量，但在函数外部则不能访问他们。如果在这个函数内部创建一个闭包，那么闭包通过自己的作用域链也可以访问这些变量。而利用这一点，就可以创建用于访问私有变量的公有方法。

我们把有权访问私有变量和私有函数的公共方法叫做特权方法。有两种在对象上创建特权方法的方式。第一种是在构造函数中定义特权的方法。

```
function MyObject(){
	var privateVariable=10;
	function privateFunction(){
		return false;
	}
	this.publicMethod=function(){
		privateVariable++;
		return privateFunction();
	}
}

```
这个模式在构造函数内部定义了所有的私有变量和函数。然后，又继续创建了能够访问这些私有成员的特权方法。能够在构造函数中定义特权方法，是因为特权方法作为闭包有权访问在构造函数中定义的所有变量和函数。 对于这个例子而言，变量privateVariabl和函数 privateFunction只能通过特权方法publicMethod来访问，在创建MyObject实例后，除了使用publicMethod()这一个途径外，没有任何方法可以直接访问privateVariabl和privateFunction。

利用私有和特权成员，可以隐藏那些不应该被直接修改的数据。

```
function Person(name){
	this.getName=function(){
		return name;
	}

	this.setName=function(value){
		name=value;
	}
}

var person=new Person('pearyman');
console.log(person.getName());
person.setName('lee');
console.log(person.getName());

```

以上代码的构造函数定义了两个特权方法。 getName()和setName()。这两个方法都可以在构造函数外部使用，而且都有权访问私有变量name。但在person构造函数外部，没有任何办法访问name。由于这两个方法是在构造函数内部定义的，他们作为闭包能够通过访问作用域链访问name。私有变量name在Person的每一个实例中都不相同，每次调用构造函数都会重新创建这两个方法。不过，在构造函数中定义特权方法也有一个缺点，那就是你必须使用构造函数模式来达到这个目的。构造函数模式的缺点就是针对每一个实例都会创建一组新的方法，而使用静态私有变量来实现特权方法就可以避免这个问题。


### 7.4.1 静态私有变量

通过在私有作用域中定义变量和函数，同样也可以创建特权方法。

```
(function(
	var privateVariabl=10;
	function privateFunction(){
		return false;
	}
	MyObject=function(){

	}
	MyObject.prototype.publicMethod=function(){
		privateVariabl++;
		return privateFunction();
	}
	))()

```

这个模式创建了一个私有作用域，并在其中封装了一个构造函数以及相应的方法。在私有作用域中，首先定义了私有变量和私有函数。然后又定义了构造函数以及公有方法。公有方法是在原型上定义的，这一点体现了典型的原型模式。

需要注意的是，这个模式在定义构造函数时并没有使用函数声明，而是使用了函数表达式。函数声明只能创建局部函数，但那并不是我们想要的。 出于同样的原因，我们也没有在声明MyObject时使用var关键字。记住：初始化未经声明的变量，总是会创建一个全局变量。因此，MyObject就成了一个全局变量，能够在私有作用域之外被访问到。但也要知道，在严格模式下给未经声明的变量赋值会导致错误。


这个模式与在构造函数中定义特权方法的主要区别，就在于私有变量和函数是由实例共享的。由于特权方法是在原型上定义的，因此所有的实例都使用同一个函数。而这个特权方法，作为一个闭包，总是保存着对包含作用域的引用。

```
(function(){
	var name='';
	Person=function(value){
		name=value;
	}
	Person.prototype.getName=function(){
		return name;
	}

	Person.prototype.setName=function(value){
		name=value;
	}
	})();

	var person1= new Person('pearyman');
	console.log(person1.getName());  
	person1.setName('lee');
	console.log(person1.getName());


	var person2=new Person('michael');
	console.log(person1.getName());
	console.log(person2.getName());

```

这个例子中的Person构造函数与getName()和setName()方法一样，都有权访问私有变量name。在这种模式下，变量name就变成了一个静态的、由所有实例共享的属性。也就说，在一个实例上调用setName()会影响所有实例。而调用setName()或新建一个Person实例都会赋予name属性一个新值。结果就是所有实例都会返回相同的值。

以这种方式创建静态私有变量会因为使用原型而增进代码复用，但每个实例都没有自己的私有变量。到底是使用实例变量，还是静态私有变量，最终还是要视你的具体需求而定。


### 7.4.2 模块模式

前面的模式是用于为自定义类型创建私有变量和特权方法的。而道格拉斯所说的模块模式则是为单例创建私有变量和特权方法。所谓单例指的就是只有一个单例的对象。按照惯例，js是以对象字面量的方式来创建单例对象的。

```
var singleton={
	name: value,
	method:function(){
		//这里是方法的代码
	}
}


```

模块模式通过为单例添加私有变量和特权方法能够使其得到增强。

```
var sington=function(){
	var privateVariabl=10;
	function privateFunction(){
		return false;
	}

	return {
		publicProperty:true,
		publicMethod:function(){
			privateVariabl++;
			return privateFunction();
		}
	}
}()

```

这个模块模式使用了一个返回对象的匿名函数。在这个匿名函数内部，首先定义了私有变量和函数。然后，将一个对象字面量作为函数的值返回。返回的对象字面量中只包含可以公开的属性和方法。由于这个对象是在匿名函数内部定义的，因此它有公有方法有权访问私有变量和函数。从本质上来讲，这个对象字面量定义的是单例的公共接口。这种模式在需要对单例进行某些初始化，同时又需要维护其私有变量时是非常有用的。

```
var application=function(){
	var components=new Array();
	components.push(new BaseComponent());

	return {
		getComponentCount:function(){
			return components.length;
		}，
		registerComponent:function(component){
			if(typeof component =='object'){
				components.push(component);
			}
		}
	}
}();

```
在web应用程序中，经常需要使用一个单例来管理应用程序级的信息。这个简单的例子创建了一个用于管理组件application对象。在创建这个对象的过程中，首先声明一个私有的components数组，并向数组中添加了一个BaseComponent的新实例。而返回对象的getComponentCount()和registerComponent()方法，都是有权访问数组components的特权方法。前者只是返回已注册的组件数目。后者用于注册新组件。
