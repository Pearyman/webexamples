/**
 * React commentBox test
 */

// var Helloworld = React.createClass({
//     render: function() {
//         return (< h1 > hello pearyman< /h1>
//     )
//   }
// })
//
//
//
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

ReactDOM.render(<ListSurvery/>, document.getElementById('example'));
