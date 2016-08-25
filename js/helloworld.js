/**
 * React commentBox test
 */
//
// 1.1
// var Helloworld = React.createClass({
//     render: function() {
//         return (< h1 > hello pearyman< /h1>
//     )
//   }
// })
//

/*
 * 1.2
 */
/*
var ListSurvery=React.createClass({
  render:function(){
    var styles={
      width: 100+'px',
      height:100+'px',
      backgroundColor:'green',
      color: '#fff'
    }
    return (
      <div style={styles} onClick={this.handleClick}>hahahaasdsdsd</div>
    )

  },
  handleClick:function(){
    alert(66);
  }
});
*/
//
// 1.3 这个state有点问题 ，无法完成既定的效果
//
/*
var DropDown=React.createClass({
  getInitialState:function(){
    return {
      showOptions:false
    }
  },
  render:function(){
    var options;
    var styles={
      width:300+'px',
      height:300+'px',
      backgroundColor:'green'
    }
    if(this.state.showOptions){
      options=(
        <ul className="options">
          <li>China</li>
          <li>Japan</li>
          <li>Fota</li>
        </ul>
      )
    }

    return (
      <div style={styles} onClick={this.handleClick}>
        <label>choose a city</label>
      </div>
    )
  },
  handleClick:function(){
    // alert(6);
    this.setState({
      showOptions:true
    })
  }
})
*/

var AnswerRadioInput=React.createClass({
  render:function(){
    return (
      <div className="radio">
        <label>
          <input type="radio"/> Label Text
        </label>
      </div>
    )
  }
})
ReactDOM.render(<AnswerRadioInput/>, document.getElementById('example'));
