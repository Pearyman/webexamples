
var React = require('react');
var ReactDom = require('react-dom');
var Rstas = require('./Rstas.jsx');

//import './style.scss';

var Hello = React.createClass({
  render : function render(){
    return (
      <div>
        <span>
        Hello {this.props.name}
        </span>
        <Rstas name='newxxxxxxx' />
      </div>
    )
  }
});

ReactDom.render(<Hello name="World" />, document.getElementById('AppRoot'));

module.exports = Hello;
