import React, { Component } from 'react';
import { array } from 'prop-types';
import { DragDropContext } from 'react-beautiful-dnd';

import Column from '../../Components/Column/Column';
import ItemGroup from '../../Components/Column/ItemGroup';

import { saveScreendoorFields } from '../../utils/screendoor';

class ScreendoorModal extends Component {
  constructor( props ) {
    super( props );
    this.state = {
      fields: {},
      additionalFields: [],
      availableFields: [],
      datetimeFields: [],
      locationFields: [],
      nameField: []
    };

    this.onDragEnd = this.onDragEnd.bind( this );
  }

  componentDidUpdate( prevProps ) {
    const { data } = this.props;

    const fields = {};

    data.forEach( ( item ) => {
      fields[item.field] = {
        field: item.field,
        name: item.name
      };
    } );

    const availableFields = Array.from( data );

    if ( data !== prevProps.data ) {
      this.setState( {
        fields,
        availableFields
      } );
    }
  }

  onDragEnd( result ) {
    const { destination, draggableId, source } = result;
    const { fields } = this.state;

    if ( !destination ) {
      return;
    }

    if (
      destination.droppableId === source.droppableId
      && destination.index === source.index
    ) {
      return;
    }

    const startGroup = source.droppableId;
    const endGroup = destination.droppableId;

    if ( startGroup === endGroup ) {
      const { [startGroup]: start } = this.state;

      const newOrder = Array.from( start );
      newOrder.splice( source.index, 1 );
      newOrder.splice( destination.index, 0, fields[draggableId] );

      this.setState( {
        [startGroup]: newOrder
      } );
    }

    if ( startGroup !== endGroup ) {
      const { [startGroup]: start } = this.state;
      const { [endGroup]: end } = this.state;

      const removeFromColumn = Array.from( start );
      const addToColumn = Array.from( end );

      removeFromColumn.splice( source.index, 1 );
      addToColumn.splice( destination.index, 0, fields[draggableId] );

      this.setState( {
        [startGroup]: removeFromColumn,
        [endGroup]: addToColumn
      } );
    }
  }

  render() {
    const {
      additionalFields, availableFields, datetimeFields, locationFields, nameField
    } = this.state;

    function cleanData( arr ) {
      const newObj = {};

      arr.forEach( ( item ) => {
        const { name } = item;
        const { field } = item;
        const nameStr = name.split( ' ' ).join( '_' );

        newObj[nameStr] = field;
      } );

      return newObj;
    }

    const dataObj = {
      date: cleanData( datetimeFields ),
      location: cleanData( locationFields ),
      name: cleanData( nameField ),
      other: cleanData( additionalFields )
    };

    return (
      <div className="iip-map-admin-screendoor-modal">
        <div className="iip-map-admin-screendoor-dragdrop">
          <DragDropContext onDragEnd={ this.onDragEnd }>
            <Column title="Available Fields">
              <ItemGroup data={ availableFields } id="availableFields" />
            </Column>
            <Column title="Map To:">
              <ItemGroup data={ nameField } id="nameField" required title="Item Name:" />
              <ItemGroup data={ locationFields } id="locationFields" required title="Location:" />
              <ItemGroup data={ datetimeFields } id="datetimeFields" title="Date/Time:" />
              <ItemGroup data={ additionalFields } id="additionalFields" title="Additional Data:" />
            </Column>
          </DragDropContext>
        </div>
        <button type="button" onClick={ () => { saveScreendoorFields( dataObj ); } }>
          Save Form Data
        </button>
      </div>
    );
  }
}

ScreendoorModal.propTypes = {
  data: array
};

export default ScreendoorModal;
