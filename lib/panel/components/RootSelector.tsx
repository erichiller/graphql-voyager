import * as _ from 'lodash';
import * as React from "react";
import { connect } from "react-redux"

import { getSchemaSelector } from '../../introspection';
import { isNode } from '../../graph/';
import { changeRootType } from '../../actions/';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

interface RootSelectorProps {
  rootTypeId: string;
  schema: any;
  dispatch: any;
}

function mapStateToProps(state) {
  return {
    rootTypeId: state.displayOptions.rootTypeId,
    schema: getSchemaSelector(state),
  };
}

class RootSelector extends React.Component<RootSelectorProps, void> {
  render() {
    const {
      dispatch,
      rootTypeId,
      schema,
    } = this.props;


    if (!schema || !rootTypeId)
      return null;

    let types = schema.types;

    const queryType = schema.types[schema.queryType];
    types = _.omit(types, queryType.id);
    const mutationType = schema.types[schema.mutationType];
    if (mutationType)
      types = _.omit(types, mutationType.id);

    types = _(types).values().filter(isNode)
      .sortBy('name').value();

    const currentRoot = schema.types[rootTypeId].id;

    return (
      <DropDownMenu className="dropdown-root" autoWidth={false}
        onChange={(event, index, value) => {
          dispatch(changeRootType(value));
        }} value={currentRoot}>

        <MenuItem value={queryType.id} primaryText={queryType.name} />
        {mutationType && (<MenuItem value={mutationType.id} primaryText={mutationType.name} />)}
        <Divider/>
        {_.map(types, type => (
          <MenuItem key={type.id} value={type.id} primaryText={type.name} />
        ))}
      </DropDownMenu>
    );
  }
}

export default connect(mapStateToProps)(RootSelector);