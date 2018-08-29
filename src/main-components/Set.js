import React from "react";

class Set extends React.Component {
	//Render functions
	render() {
		return ( < li role = "button"
			className = "place"
			tabIndex = "0"
			onKeyPress = {this.props._toggleInfoBox.bind(this, this.props.data.marker)}
			onClick = {this.props._toggleInfoBox.bind(this, this.props.data.marker)} 
			> {this.props.data.informations} < /li>);
	}
}
export default Set;
