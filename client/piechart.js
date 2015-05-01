
VotosSub = Meteor.subscribe('PubVotos');
UsersSub = Meteor.subscribe('meteor_autoupdate_clientVersions');

PieSegmentOptions = {
  'Si': { label: 'Si', color: '#449d44'  },
  'No': { label: 'No', color: '#c9302c'  }
};



Template.piechart.helpers({
  pieSegments: function () {
        // Returns the values of PieSegmentOptions, extended with `_id`
        var result = [];
        for (var id in PieSegmentOptions) {
          result.push(_.extend({ _id: id }, PieSegmentOptions[id]));
        }
        return result;



  },

  getCount: function (id) {
      // Return the `.count` of a document by `_id`.  Guard against
      // the document not being loaded yet.
      var doc = Votos.findOne(id);
      return doc ? doc.count : 0;
  },

  yaVoto: function(){
    return Meteor.users.find({ 'profile.yavoto':1 }).count();

  },

  dataLoaded: function () {
    return UsersSub.ready();
  },

  usersReady: function () {
    return VotosSub.ready();
  }

});



Template.piechart.events({
  'click .increment-button': function (evt) {
  
    var voto = evt.target.getAttribute("data-id");
    Meteor.call('votar',voto);
  }
  
});






/// Template.piecanvas

Template.piecanvas.rendered = function () {
  var template = this;

  var ctx = template.find('#piechart').getContext("2d");
  var chart = new Chart(ctx).Doughnut([], {
   
  });
  template.chart = chart;

  var observeCallbacks = {
    addedAt: function (doc, index) {
      chart.addData(_.extend({},
                             PieSegmentOptions[doc._id] || { label: doc._id },
                             { value: doc.count }),
                    index);
    },
    changedAt: function (newDoc, oldDoc, index) {
      chart.segments[index].value = newDoc.count;
      chart.update();
    },
    removedAt: function (oldDoc, index) {
      chart.removeData(index);
    },
    movedTo: function (doc, fromIndex, toIndex) {
      observeCallbacks.removedAt(doc, fromIndex);
      observeCallbacks.addedAt(doc, toIndex);
    }
  };

  template.observeHandle = Votos.find().observe(observeCallbacks);
};

Template.piecanvas.destroyed = function () {
  if (this.observeHandle) {
    this.observeHandle.stop();
    this.observeHandle = null;
  }
};
