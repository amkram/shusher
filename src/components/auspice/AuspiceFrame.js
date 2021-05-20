import React from 'react'
import { showTree } from './showTree'


class AuspiceFrame extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    showTree(this.props.dispatch, 'file from somewhere');
  }

  render() {
    return (
      <div className="static container">
      This is the Auspice Frame
      </div>
    );
  }
}

export default AuspiceFrame;
