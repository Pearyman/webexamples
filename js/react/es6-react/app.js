import React from 'react';

class App extends React.Component {
    render() {
        let txt = this.props.txt;
        return ( < div > < h1 > {
            txt
        } < /h1></div > )
    }
}
App.propTypes = {
    txt: React.propTypes.string,
    cat: React.propTypes.number
}

App.defaultProps = {
    txt: 'swsq'
}

export default App;
