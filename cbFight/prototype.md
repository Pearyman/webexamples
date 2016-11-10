
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



### 3 更简单的原型语法

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

### 6 原型对象的问题

原型模式也不是没有缺点。首先，它省略了为构造函数传递初始化参数这一环节。结果所在实例在默认情况下都将取得相同的属性值。虽然这会在某种程度上带来一些不方便，但还不是原型的最大问题。原型模式的最大问题是由其共享的本性所导致的。

原型中的所有属性是被很多实例共享的，这种共享对于函数非常合适。对于那些包含基本值的属性倒也说得过去，毕竟通过实例上添加一个同名属性，可以隐藏原型中的对应属性。然而，对于包含引用类型值的属性来说，问题就比较突出了。

```
function Person(){}

Person.prototype={
  constructor:Person,
  name:'da',
  age:11,
  job:'dssa',
  friends:['a','b'],
  sayName:function(){
    console.log(this.name)
  }
}

var person1=new Person();
var person2=new Person();
person1.friends.push('lee');

console.log(person1.friends);  // a b lee
console.log(person2.friends);  // a b lee
console.log(person1.friends===person2.friends); //true


```

在此，person.prototype对象有一个名为friends的属性，该属性包含一个字符串数组。然后创建了person的两个实例。接着，修改了person1.friends引用的数组，向数组中添加了一个字符串。由于friends数组存在于person.prototype而非person1中。所以刚刚提到的修改也会通过person2.friends反映出来。我们的初衷就是像这样在所有的实例中共享一个数组，那么对这个结果我也无话可说。

可是，实例一般都是要有属于自己的全部属性的。而这个问题正是我们很少看到有人单独使用原型模式的原因所在。

### 6.2.4 组合使用构造函数模式和原型模式

创建自定义类型的最常见方式，就是组合使用构造函数模式以及原型模式。构造函数模式用于定义实例属性，而原型模式用于定义方法和共享的属性。结果，每个实例都会有自己的一份实例属性的副本，但同时又共享着对方法的引用，最大限度的节省了内存。另外，这种混成模式还支持向构造函数传递参数；可谓是集两种模式之长。下面代码所示：


```
function Person(name,age,job){
  this.name=name;
  this.age=age;
  this.job=job;
  this.friends=['a','b'];

}

Person.prototype={
  constructor:Person,
  sayName:function(){
    console.log(this.name);
  }
}

var person1=new Person('da',12,'qdq');
var person2=new Person('ss',12,'qdq');
person1.friends.push('lee');
console.log(person1.friends);  //['a','b','lee']
console.log(person2.friends);  //['a','b']

```

在这个例子中，实例属性都是在构造函数中定义的，而由所有实例共享的属性constructor和方法sayName()是在原型中定义的。而修改了person1.friends，并不会影响到person2.friends，因为它们引用了不同的数组。


### 6.2.5 动态原型模式

有其他的OO语言开发经验的开发人员在看到独立的构造函数和原型时，有可能会感到很困惑。动态原型模式正式致力于解决这个问题的一个方案。

它把所有的信息都封装在构造函数中，而通过在构造函数中初始化原型，又保持了同时使用构造函数和原型的优点。换句话说，可以通过检查某个应该存在的方法是否有效，来决定是否需要初始化原型。

```


```
