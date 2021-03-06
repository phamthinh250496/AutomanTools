import React from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import { mainStyle } from 'automan/assets/main-style';
import TextField from '@material-ui/core/TextField';

class CandidateSelect2D3D extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      candidates: [],
      candidates_2d: [],
      candidates_3d: [],
      name: '',
      original: { name: null }
    };
  }
  componentDidMount() {
    const original_id = this.props.original_id;
    this.props.handleSetJobConfig({
      name: '',
      original_id: this.props.original_id
    });
    const candidates = this.props.handleGetJobConfig('candidates');
    const name = this.props.handleGetJobConfig('name');
    this.setState({ candidates: candidates, name: name });
    let urlBase =
      `/projects/${this.props.currentProject.id}/originals/${original_id}`;
    let imgUrl = urlBase + '/candidates/?data_type=IMAGE';
    let pcdUrl = urlBase + '/candidates/?data_type=PCD';
    RequestClient.get(
      imgUrl,
      null,
      data => {
        this.setState({ candidates_2d: data.records });
      },
      () => { }
    );
    RequestClient.get(
      pcdUrl,
      null,
      data => {
        this.setState({ candidates_3d: data.records });
      },
      () => { }
    );
  }
  handleChangeCandidate = e => {
    let candidates = this.props.handleGetJobConfig('candidates');
    if (e.target.checked == true) {
      candidates.push(Number(e.target.value));
    } else {
      candidates = candidates.filter(n => n !== Number(e.target.value));
    }
    this.setState({ candidates: candidates });
    this.props.handleSetJobConfig('candidates', candidates);

    let is_2d_selected = this.state.candidates_2d.some(
      x => candidates.includes(x.candidate_id));
    let is_3d_selected = this.state.candidates_3d.some(
      x => candidates.includes(x.candidate_id));
    this.props.handleSelect(is_2d_selected && is_3d_selected);
  };
  handleChangeName = e => {
    const name = e.target.value;
    this.setState({ name: name });
    this.props.handleSetJobConfig('name', name);
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">Dataset Name</FormLabel>
          <FormGroup>
            <FormControlLabel
              control={
                <TextField
                  label="rosbag.bag"
                  onChange={this.handleChangeName}
                  value={this.state.name}
                />
              }
            />
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">2D Candidates</FormLabel>
          <FormGroup>
            {this.state.candidates_2d.map((x, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      onChange={this.handleChangeCandidate}
                      value={x.candidate_id.toString()}
                      checked={this.state.candidates.includes(x.candidate_id)}
                    />
                  }
                  label={JSON.parse(x.analyzed_info).topic_name}
                />
              );
            })}
          </FormGroup>
        </FormControl>
        <FormControl component="fieldset" className={classes.formControl}>
          <FormLabel component="legend">3D Candidates</FormLabel>
          <FormGroup>
            {this.state.candidates_3d.map((x, index) => {
              return (
                <FormControlLabel
                  key={index}
                  control={
                    <Checkbox
                      onChange={this.handleChangeCandidate}
                      value={x.candidate_id.toString()}
                      checked={this.state.candidates.includes(x.candidate_id)}
                    />
                  }
                  label={JSON.parse(x.analyzed_info).topic_name}
                />
              );
            })}
          </FormGroup>
        </FormControl>
      </div>
    );
  }
}

CandidateSelect2D3D.propTypes = {
  classes: PropTypes.object.isRequired
};
const mapStateToProps = state => {
  return {
    currentProject: state.projectReducer.currentProject
  };
};

export default compose(
  withStyles(mainStyle, { name: 'CandidateSelect2D3D' }),
  connect(
    mapStateToProps,
    null
  )
)(CandidateSelect2D3D);
