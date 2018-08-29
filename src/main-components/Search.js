import React, { Component } from "react";
import Set from "./Set";

class Searching extends Component {
	constructor(props) {
		super(props);
		this.state = { query: "" };
		//	this.togglePlaces = () => this.togglePlaces();
		this.togglePlaces = this.togglePlaces.bind(this);}
		componentWillMount() {
		this.setState({
			places: this.props.locationsList
		});
	}
	//Here we gonna filter out or turn on and off places that we want to see!	
	togglePlaces(event) {
		let places = [];
		const {value} = event.target;
		this.props.locationsList.forEach(function(location) {
			let visible = location.marker.setVisible(true);
			//	The method toLowerCase() converts the characters of a String into lower case characters, that leaves no room for errors while searching with the search bar.
			let convert = value.toLowerCase();
			if (location.informations.toLowerCase().indexOf(convert) >= 0) {visible;
																			places.push(location);}
		    //This will filter the visible markers, turning it on and off regarding the typed text.			
			else {location.marker.setVisible(false);}
		});
		let sets = 
		this.setState({ places: places, query: value });
	}
//Render functions of places
	render() {
    return (
      <div className="search-bar">
        <input
          role="search"
          aria-labelledby="filter"
          id="searching-field"
          className="search-input"
          type="text"
          placeholder="Type here and Discover Zagreb!"
//Displaying and binding with the app.js
          value={this.state.query}
          onChange={this.togglePlaces}/>
          <ul className="location-list">
          {this.state.visibleList=true && this.state.places.map(function(listItem, index) {
				return ( < Set key = {index}
					_toggleInfoBox = {this.props.toggleInfoBox.bind(this)}
					data = {listItem}
					/>);
			        }, this)}
        </ul>
      </div>
    );
  }
}

export default Searching;
