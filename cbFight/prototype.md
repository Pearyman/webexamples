
### 2 原型和in操作符

有两种方式使用In操作符：单独使用和在for-in循环中使用。在单独使用时，in操作符会在通过对象能够访问给定属性时返回true,
无论该属性存在于实例中还是原型中。


```
function Person(){

}

Person.prototype={
  name:'sa',
  age:23,
  job:'wew',
  sayName:function(){
    console.log(this.name);
  }
}
console.log("name" in Person); // true

```

在以上代码执行的过程中，name属性要么是直接在对象上访问到的。要么是通过原型访问到的。 因此调用name in perosn1始终都是返回true。

无论该属性存在于实例中还是原型中。同时使用hasOwnProperty()方法和in操作符，就可以确定该属性到底是在存在对象中，还是原型中。

```
function hasPrototypeProperty(object,name){
  return !object.hasOwnProperty(name) && (name in object);
}

```

由于in操作符只要通过对象能够访问到属性就返回true,hasOwnProperty()只是在属性存在于实例中时才返回true。因此只要In返回true而hasOwnProperty返回false ，就可以确定属性是原型中的属性。

在使用for-in循环时，返回的是所有能够通过对象访问的、可枚举的属性。其中既包括存在实例中的属性，也包括存在于原型中的属性。屏蔽了原型中不可枚举的属性的实例属性也会在for-in循环中返回，因为根据规定，所有开发人员定义的属性都是可枚举的。


ie在早期的版本中存在一个Bug,即屏蔽不可枚举属性的实例属性不会出现在for-in循环中。



### 更简单的原型语法

前面的例子中每添加一个属性和方法就要敲一遍Person.prototype。为减少不必要的输入，也为了从视觉上更好的封装原型的功能。更常见的做法是用一个包含所有属性和方法的对象字面量来重写整个原型对象。

```
Person.prototype={
  name:'pearyman',
  age:21,
  job:'software engineer',
  sayName:function(){
    console.log(this.name);
  }
}

```

我们将Person.prototype设置为等于一个以对象字面量形式创建的新对象。 最终结果相同。

但有一个例外，constructor属性不再指向Person了。   每创建一个函数，就会同时创建它的prototype对象，这个对象也会自动获得constructor属性。而我们在这里使用的语法，本质上完全重写了默认的prototype对象，因此constructor属性也就变成了新的constructor属性，不再指向Person函数，此时，尽管instanceof操作符还能返回正确的结果，但通过constructor已经无法确定对象了类型了。

```
var friend=new Person();

console.log(friend instanceof Object); //true
console.log(friend instanceof Person); //true
console.log(friend.constructor== Person); //false
console.log(friend.constructor== Object); //true

```

用instanceof操作符测试Object 和 person仍然返回true。 但constructor属性则等于object 而不等于person了。如果constructor的值很重要，那你可以设置它的值。

```
function Person(){

}

Person.prototype={
  constructor:Person,
  name:'qwe',
  age:12,
  job:'seqe'
}

```
以上代码特意包含了一个constructor属性，并将他的值设置为person，从而确保了通过该属性能够访问到适当的值。

注意 以这种方式重设constructor属性会导致它的特性被设置成true。默认情况下，原生的constructor属性是不可枚举的，因此如果你使用兼容的javascript引擎，可以试一试Object.defineProperty();



### 4 原型的动态性
由于在原型中查找值的过程是一次搜索，因此我们对原型对象所做的任何修改都能够立即从实例上反应出来，即使是先创建了实例后修改原型也照样如此。

```
 var friend=new Person();
 Person.prototype={
   sayHi:function(){
     console.log("hi");
   }
 }

 friend.sayHi();

```


以上代码创建了一个Person实例，并将其保存在person中。然后，下一条语句在person.prototype中添加一个方法sayHi()



### 5 原生对象的原型

原型模式的重要性不仅体现在创建自定义类型方面，就连所有原生的引用类型，都是采用这种模式创建的。 所有原生引用类型(object array string等)都在其构造函数的原型上定义了方法。例如，在Array.prototype中可以找到sort()方法，而在string.prototype()中可以找到substring()方法


```
alert(typeof Array.prototype.sort); // function
alert(typeof String.prototype.substring) //function

```

通过原生对象的原型，不仅可以取得所有默认方法的引用，而且可以定义新方法。可以像修改自定义对象的原型一样修改原生对象的原型,因此可以随时添加方法，而在string.prototype中可以找到substring()方法,如下所示：


```
String.prototype.startWith=function(text){
  return this.indexOf(text)==0;
}

var message='hello world';
console.log(message.startWith('hello'));

```

这里通过定义startWith()方法会在传入的文本位于一个字符串开始返回true。既然方法被添加给了String.prototype，那么当前的环境中的所有字符串就都可以调用它。由于message是字符串，而且后台会调用String基本包装函数创建这个字符串，因此message就调用了startWith()方法。

注意：  尽管可以这样做，但我们不推荐在产品化的程序中修改原生对象的原型。如果因某个实现中缺少的方法，就在原生对象的原型中添加这个方法，那么当在另一个支持该方法的实现中运行代码时，就可能会导致命名冲突。而且，这样做也可能会意外的重写方法。
