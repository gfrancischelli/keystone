/** @jsx React.DOM */

var React = require('react'),
	Field = require('../field'),
	Note = require('../../components/note'),
	pikaday = require('pikaday'),
	moment = require('moment');

module.exports = Field.create({

	supports: {
		focusTarget: 'dateInput'
	},

	// default formats
	inputFormat: 'YYYY-MM-DD',

	getInitialState: function() {
		return { 
			value: this.props.value ? moment(this.props.value).format(this.inputFormat) : ''
		};
	},

	getDefaultProps: function() {
		formatString: 'Do MMM YYYY'
	},

	componentDidMount: function() {
		// just return if noedit is enabled
		if (this.props.noedit) {
			return;
		}

		// add date picker
		this.picker = new Pikaday({ 
			field: this.refs.dateInput.getDOMNode(),
			format: this.inputFormat,
			onSelect: function(date) {
				this.setDate(this.picker.toString());
			}.bind(this)
		});			

	},
	componentWillUnmount: function() {
		// clean up
		this.picker.destroy();
	},

	// TODO: Move isValid() so we can share with server-side code
	isValid: function(value) {
		return moment(value, this.inputFormat).isValid();
	},

	// TODO: Move format() so we can share with server-side code
	format: function(dateValue, format) {
		format = format || this.inputFormat;
		return dateValue ? moment(this.props.dateValue).format(format) : '';
	},

	setDate: function(dateValue) {
		this.setState({ value: dateValue });
		this.props.onChange({
			path: this.props.path,
			value: this.isValid(dateValue) ? moment(dateValue, this.inputFormat).toISOString() : null
		});
	},

	setToday: function() {
		this.setDate(moment().format(this.inputFormat));
	},

	valueChanged: function(event) {
		this.setDate(event.target.value);
	},

	renderUI: function() {
		
		var input, fieldClassName = 'field-ui';

		if (this.props.noedit) {
			input = (
				<div className={fieldClassName}>
					<div className="field-value">{this.format(this.props.value, this.props.formatString)}</div>
				</div>
			);
		} else {
			input = (
				<div className={fieldClassName}>
					<input type="text" name={this.props.path} ref="dateInput" value={this.state.value} onChange={this.valueChanged} autoComplete="off" className="form-control" />
					<a className="btn btn-default btn-set-today" onClick={this.setToday}>Today</a>
				</div>
			);
		}
		
		return (
			<div className="field type-date">
				<label className="field-label">{this.props.label}</label>
				{input}
				<div className="col-sm-9 col-md-10 col-sm-offset-3 col-md-offset-2">
					<Note note={this.props.note} />
				</div>
			</div>
		);
	}

});
