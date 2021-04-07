const express = require('express');
const router = express.Router();

const Note = require('../models/Node');

const { isAuthenticated } = require('../helpers/auth');

router.get("/notes/add", isAuthenticated, (req,res)=>{
	res.render('notes/new-note');
});

router.post("/notes/new-note", isAuthenticated,async (req, res)=>{
	const { title, description } = req.body;
	const errors = [];
	if (!title) {
		errors.push({text: "Por favor Escriba Un Titulo"});
	}; 
	if (!description) {
		errors.push({text: "Por favor Escriba Una Descripcion"});
	};
	if (errors.length > 0){
		res.render("notes/new-note", {
			errors,
			title,
			description
		});
	} else {
		const newNote = new Note({ title, description });
		newNote.user = req.user.id;
		await newNote.save();
		req.flash('success_msg', 'Nota Agregada Correctamente');
		res.redirect("/notes");
	};
});

router.get('/notes', isAuthenticated,async (req, res) => {
	await Note.find({ user: req.user.id }).sort({ date: 'desc' })
		.then(documents => {
			const context = {
				notes: documents.map(documents => {
					return {
						title: documents.title,
						description: documents.description,
						id: documents._id
					};
				})
			};
			res.render('notes/all-notes', {
				notes: context.notes
			});
		});
});

router.get('/notes/edit/:id', isAuthenticated, async (req,res) => {
	const note = await Note.findById(req.params.id).lean();
	res.render('notes/edit-notes', {note});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req,res) => {
	const { title, description } = req.body;
	await Note.findByIdAndUpdate(req.params.id, { title, description });
	req.flash('success_msg', 'Nota Actualizada Correctamente');
	res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
	await Note.findByIdAndDelete(req.params.id);
	req.flash('success_msg', 'Nota Eliminada Correctamente');
	res.redirect('/notes');
});

module.exports = router;