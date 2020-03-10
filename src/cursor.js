import {isString} from 'vega-util';

var Default = 'default';

export default function(view) {
  var cursor = view._signals.cursor;

  // add cursor signal to dataflow, if needed
  if (!cursor) {
    view._signals.cursor = (cursor = view.add({user: Default, item: null}));
  }

  // evaluate cursor on each mousemove event
  view.on(view.events('view', 'mousemove'), cursor,
    function(_, event) {
      var value = cursor.value,
          user = value ? (isString(value) ? value : value.user) : Default,
          item = event.item && event.item.cursor || null;

      return (value && user === value.user && item == value.item) ? value
        : {user: user, item: item};
    }
  );

  // when cursor signal updates, set visible cursor
  view.add(null, function(_) {
    var user = _.cursor,
        item = this.value;

    if (!isString(user)) {
      item = user.item;
      user = user.user;
    }

    setCursor(view, user && user !== Default ? user : (item || user));

    return item;
  }, {cursor: cursor});
}

function setCursor(view, cursor) {
    const container = view.container()
    if(container){
      container.style.cursor = cursor;
    }   
}
