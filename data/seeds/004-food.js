exports.seed = function(knex) {
	// Deletes ALL existing entries
	return knex("food")
		.truncate()
		.then(function() {
			// Inserts seed entries
			return knex("food").insert([
				{
					event_id: 1,
					recipe_name: "Pizza",
					user_id: null
				},
				{
					event_id: 1,
					recipe_name: "Beer",
					user_id: 1
				},
				{
					event_id: 2,
					recipe_name: "Amway",
					user_id: 2
				}
			]);
		});
};
