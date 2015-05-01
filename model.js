Votos = new Meteor.Collection('votos');


if (Meteor.isServer) {
  Meteor.startup(function () {
  	 if (Votos.find().count() === 0) {
      Votos.insert({ _id: 'Si', count: 0 });
      Votos.insert({ _id: 'No', count: 0 });
    }
    
  });

  Meteor.publish('PubVotos', function () {
    return Votos.find();
  });
}
