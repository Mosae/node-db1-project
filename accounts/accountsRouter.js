const express = require('express');
//database access usin knex
const db = require('../data/dbConfig.js');

const router = express.Router();

router.get('/', (req, res) => {
	//get list of all accounts from database
	db.select('*')
		.from('accounts')
		.then((accounts) => {
			res.status(200).json({ data: accounts });
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
});

//database will always return an collection array
router.get('/:id', (req, res) => {
	db('accounts')
		.where({ id: req.params.id })
		.first()
		.then((account) => {
			if (account) {
				res.status(200).json(account);
			} else {
				res.status(400).json({ message: 'There is no account with that id' });
			}
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
});
router.post('/  ', (req, res) => {
	// const { id } = req.params;
	const account = req.body;
	//an account must have a name and budget
	//once you know the post is valid, save it to the db
	if (isValidAccount(account)) {
		db('accounts')
			// there will be a warning in the console about .returnnin(), ignore it for SQLite
			.insert(account, 'id')
			.then((ids) => {
				res.status(201).json({ data: ids });
			})
			.catch((error) => {
				res.status(500).json({ message: error.message });
			});
	} else {
		res
			.status(400)
			.json({ message: 'Please provide unique name and budget for account' });
	}
});
router.put('/:id', (req, res) => {
	const changes = req.body;
	//validate the data
	db('accounts')
		.where({ id: req.params.id }) // 1st filter based on the param
		.update(changes)
		.then((count) => {
			// the count is the number of records updated
			// if the count is 0 it means that the record was not fond
			if (count) {
				res.status(201).json({ data: count });
			} else {
				res.status(4).json({ message: 'The account was not found by that id' });
			}
			res.status(201).json({ data: count });
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
});

router.delete('/:id', (req, res) => {
	db('accounts')
		.where({ id: req.params.id }) // 1st filter based on the param
		.del()
		.then((count) => {
			// the count is the number of records updated
			// if the count is 0 it means that the record was not fond
			if (count) {
				res.status(201).json({ data: count });
			} else {
				res.status(4).json({ message: 'The account was not found by that id' });
			}
			res.status(201).json({ data: count });
		})
		.catch((error) => {
			res.status(500).json({ message: error.message });
		});
});

function isValidAccount(account) {
	// check to see if you have both properties
	return Boolean(account.name && account.budget);
}

module.exports = router;
