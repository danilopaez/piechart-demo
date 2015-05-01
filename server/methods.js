Meteor.methods({
  'votar': function(voto) {

  	if(!Meteor.call('usuarioYaVoto')){

  		Meteor.users.update(Meteor.userId(), { $set: { 'profile.yavoto': 1 } });    
    	Votos.update(voto, { $inc: { count: 1 } });    
	}
  },



  'usuarioYaVoto': function (){
  	
  	return Meteor.users.find({"_id" : Meteor.userId(), 'profile.yavoto':1 }).count();
  },

  'resetear': function (){
    
    Meteor.users.remove({});
    Votos.remove({});
    

  }

});

