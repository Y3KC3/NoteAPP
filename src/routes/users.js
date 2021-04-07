const express = require('express');
const router = express.Router();

const User = require('../models/Users');
const passport = require('passport');

router.get("/users/signin", (req,res) => {
	res.render('users/signin');
});

router.post('/users/signin', passport.authenticate('local', {
	successRedirect: '/notes',
	failureRedirect: '/users/signin',
	failureFlash: true
}));

router.get("/users/signup", (req,res) => {
	res.render('users/signup');
});

router.post('/users/signup', async (req,res) => {
	const { name, email, password, confirmPassword } = req.body;
	const errors = [];
	if (name.length <= 3){
		errors.push({text: 'El Nombre Debe Tener Al Menos 4 Caracteres'});
	};
	if (email.length <= 0){
		errors.push({text: 'Por favor Ingrese Un Correo'});
	};
	if (password.length <=0){
		errors.push({text: 'Por favor Ingrese Una Contraseña'});
	};
	if (password != confirmPassword){
		errors.push({text: 'Las Contraseñas No Coinciden'});
	};
	if (password.length < 4){
		errors.push({text: 'La Contraseña Al Menos Debe Tener 4 Caracteres'});
	};
	if (errors.length > 0) {
		res.render('users/signup', {errors, name, email, password, confirmPassword});
	} else {
		const emailUser = await User.findOne({email: email});
		if (emailUser){
			req.flash('error_msg','El Correo Esta En Uso');
			res.redirect('/users/signup');
		};
		const newUser = new User({name, email, password});
		newUser.password = await newUser.scryptPassword(password);
		await newUser.save();
		req.flash('success_msg','Ya Estas Registrado');
		res.redirect('/users/signin');
	};
});

router.get('/users/logout', (req,res)=>{
	req.logout();
	res.redirect('/');
});

module.exports = router;