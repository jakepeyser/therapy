//React/Redux
import React from 'react';
import {connect} from 'react-redux';
//Components
import PlanOptions from './newPlanOptions';
import PatientPanel from './PatientPanel';
import Treatment from './treatment';
import CreatedTreatments from './createdTreatments';

//material-ui
import {StepsRaisedButton, StepsFlatButton} from '../material-style'
import {DropDownMenu, MenuItem, Divider, FloatingActionButton, TextField, SelectField, Link,Paper} from 'material-ui';
import {RaisedButton, Table, TableHeader, TableRow,TableHeaderColumn, TableRowColumn} from 'material-ui';
import ContentAdd from 'material-ui/svg-icons/content/add';

const createPlan = (plan) => { console.log(plan) }

/* PROPS:
  patient: {
    id, first_name, last_name, img_url, ...biodata
  },
  exercises: [{
    id, title, description, img_url, vid_url, therapist_id
  }]
*/

// styling
const styleRow = {
  'display' : 'flex',
  'marginTop' : '1em'
};

const initialTreatment = {
  time_per_exercise: 0,
  reps: 0,
  sets: 0,
  resistance: '',
  notes: ''
}

//=======  Component===============
class NewPlan extends React.Component{
  constructor(props){
    console.log(props);
    super(props);

    this.state={
      duration : 0,
      therapy_focus : "",
      notes : "",
      selectedExercise : {},
      treatment: initialTreatment,
      treatments : []
    };

    this.durationOnChange = this.durationOnChange.bind(this);
    this.therapyHandler = this.therapyHandler.bind(this);
    this.noteHandler = this.noteHandler.bind(this);
    this.exerciseOnChange = this.exerciseOnChange.bind(this);
    this.notesOnChange = this.notesOnChange.bind(this);
    this.treatmentHandler = this.treatmentHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.addNewTreatment = this.addNewTreatment.bind(this);
    this.removeTreatment = this.removeTreatment.bind(this);
  }

// persisting on local state for plan for duration and injury
  durationOnChange(evt, idx, value) {
    this.setState({ duration: value });
  }

//onchange handler for therapy_focus
  therapyHandler(evt) {
    this.setState({therapy_focus : evt.target.value});
  }

//onchange handler for PlanNotes
  noteHandler(evt) {
    this.setState({notes : evt.target.value});
  }

// handle change to this.state.exercise
  exerciseOnChange(evt, idx) {
    this.setState({ selectedExercise: this.props.exercises[idx] });
  }

  notesOnChange(evt) {
    this.setState({ treatment: { notes: evt.target.value }})
  }

// treatment handler for this.state.treatment
  treatmentHandler(field, value) {
    console.log('field', field)
    console.log('value', value)
    this.setState({ treatment :{[field]: value }})
  }

// Add/Remove Treatments
  addNewTreatment() {
    let treatment = {
      time_per_exercise: this.state.treatment.time_per_exercise,
      reps: this.state.treatment.reps,
      sets: this.state.treatment.sets,
      resistance: this.state.treatment.resistance,
      notes: this.state.treatment.notes,
      exercise_id: this.state.selectedExercise.id,
      patient_id: this.props.currentPatient.id
    }
    if (this.state.treatments.length === 0) {
      this.setState({ treatments: [treatment] })
    } else {
      this.setState({ treatments: this.state.treatments.push(treatment) })
    }
    this.setState({ treatment: initialTreatment })
  }

  removeTreatment(idx) {
    this.setState({ treatments: this.state.treatments.filter(treatment => {
      if (treatment.idx !== idx) return treatment
      })
    })
  }

  //setting all local state and submit entire plan
  submitHandler(evt) {
    evt.preventDefault()
    let newPlan = {
      duration : this.state.duration,
      therapy_focus : this.state.therapy_focus,
      notes : this.state.notes,
      patient_id: this.props.currentPatient.id,
      treatments: this.state.treatments
    }
    this.props.submitPlan(newPlan)
  }

  render(){

    return(
      <div className="container">
        <div className='row' id="newPlan">
          <div className='col-md-10'>
          <form onSubmit={this.submitHandler}>
              <PlanOptions
                durationOnChange={this.durationOnChange}
                therapyHandler={this.therapyHandler}
                noteHandler={this.noteHandler}
                note={this.state.notes}
                duration={this.state.duration}
                therapy_focus={this.state.therapy_focus}
              />
            <div className="row" style={styleRow}>
              <div className="col-md-4">
              <SelectField floatingLabelText="Exercise" value={this.state.selectedExercise.title} onChange={this.exerciseOnChange} maxHeight={200}>
                {this.props.exercises.map((exercise, idx) => {
                  return ( <MenuItem key={exercise.id} value={exercise.title} primaryText={exercise.title} /> )
                })}
              </SelectField>
              </div>
            </div>
            <Treatment
              exercise={this.state.selectedExercise}
              treatment={this.state.treatment}
              addTreatment={this.state.addNewTreatment}
              notesOnChange={this.state.notesOnChange}
              treatmentHandler={this.state.treatmentHandler}
            />
            <CreatedTreatments
              exercises={this.props.exercises}
              treatments={this.state.treatments}
              removeTreatment={this.state.removeTreatment}
            />
          </form>
          </div>

          <div className='col-md-2'>
            <div className="row">
              <PatientPanel patient={this.props.currentPatient} />
            </div>
            <div className="row">
              <RaisedButton primary={true} type="submit" label="Create Plan" style={{width: '100%'}}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

//========Container =============== Temporary :D =========

const mapStateToProps = (state) => ({
  user: state.user,
  currentPatient: fakePatient,
  exercises: fakeExerciseArray
});

const mapDispatchToProps = (dispatch) => ({
  submitPlan: (plan) => dispatch(createPlan(plan))
});

export default connect(mapStateToProps, mapDispatchToProps)(NewPlan);

//======FAKE DATA ============
const fakeExerciseArray = [{
  "id" : 1,
  "title" : "Horizontal Abduction",
  "description" : " Start by lying on your stomach and your arm dangling",
  "img_url" : "http://www.stellarhealthcenter.com/Exercises=Stretch/resized/Shoulder-Prone-Horizontal-Abduction.jpg",
  "vid_url" : ""
 },
 {
   "id" : 2,
   "title" : "Wall or Table Push Up",
   "description" : "To do this correctly, raise your arms up in front of you so your arms are even with the ground. Then try and make your arms a little longer by bringing your shoulders forward. This is the +, it is what you want to feel at the end each push up.",
   "img_url" : "http://www.stellarhealthcenter.com/Exercises=Stretch/resized/shoulder-wall-push-up-start.jpg",
   "vid_url" : ""
  },
  { "id" : 3,
    "title" : "Prone External Rotation",
    "description" : "Start by lying on your stomach and your arm dangling",
    "img_url" : "../../../src/images/defaultProfile.png",
    "vid_url" : ""
  }
];

const fakePatient = {
  id : 1,
  first_name : "John",
  last_name : "doe",
  img_url : "",
  email : "johndoe@gmail.com",
  DOB : 'DEC 10 1989',
  gender : 'M'
};
