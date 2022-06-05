const request = require('supertest');
const app = require('../app')
const connectToDb = require('../mongo')
const User = require('../user/model')
const Fav = require('../fav/model')

let dbConnection;

beforeAll(async ()=>{
	dbConnection = await connectToDb()
})

beforeEach(async()=>{
	await User.deleteMany();
	await Fav.deleteMany();
})

afterAll(async ()=>{
	await dbConnection.disconnect()
})

const validUser = {
	email: 'user1@test.com',
	password: 'Test!12345'
}


const favList = {
	name: "ropa",
	favs: [
		{
			name: "Casaca",
					description: "Azul",
					link: "https://www.example-casaca.com"
			},
			{
				name: "Pantalón",
				description: "Verde",
				link: "https://www.example-pantalon.com"
			}
		]
	}
	
	const postValidUser = (user = validUser) => {
		return request(app)
			.post('/auth/create')
			.send(user)
	}
	
	const postFavList = (token) =>{
	return request(app)
		.post('/api/favs')
		.send(favList)
		.set('authorization', `Bearer ${token}`)
}

const signInUser = ( user = validUser) =>{
	return request(app)
		.post('/auth/local/login')
		.send(user)
}

const deteleFavList = (id, token) =>{
	return request(app)
	.delete(`/api/favs/${id}`)
	.set('authorization', `Bearer ${token}`)
}

const getAllFavsList = (token) =>{
	return request(app)
	.get(`/api/favs`)
	.set('authorization', `Bearer ${token}`)
}

const getOneFavsList = (token, id) =>{
	return request(app)
	.get(`/api/favs/${id}`)
	.set('authorization', `Bearer ${token}`)	
}

describe('User Registration', ()=>{

	it('Return "201 OK" when signup request is valid', async ()=>{
		const response = await postValidUser()
		expect(response.status).toBe(201);
	})
	
	it('Return "user created" when signup request is valid', async ()=>{
		const response = await postValidUser()
		expect(response.body.status).toBe('user created');
	})
	
	it('Saves the user when signup request is valid', async ()=>{
		await postValidUser()
		const userList = await User.find()
		expect(userList.length).toBe(1);
	})

	it("Saves the user's email to database", async ()=>{
		await postValidUser()
		const userList = await User.find()
		const { email } = userList[0]
		expect(email).toBe('user1@test.com')
	})

	it("Hashes the password in database",async ()=>{
		await postValidUser()
		const projection = ['+password']
		const userList = await User.find().select(projection)
		const {password} = userList[0]
		expect(password).not.toBe('Test!12345')
	})
})

describe('User Singin',()=>{
	it('Return token when signining valid user', async()=>{
		await postValidUser()
		const response = await signInUser()
		expect(response.body.token).not.toBeFalsy()
	})

	it("Return 'Correo o contraseña incorrecta' when user's email doesn't exist", async ()=>{
		await postValidUser()
		const invalidUser = {
			email: 'user-no-exist@test.com',
			password: 'Test!12345'
		}
		const response = await signInUser(invalidUser)
		expect(response.body.message).toBe('Correo o contraseña incorrecta')
	})

	it("Return 'Correo o contraseña incorrecta' when user's password is incorrect", async ()=>{
		await postValidUser()
		const invalidUser = {
			email: 'user1@test.com',
			password: 'Password-Incorrect!'
		}
		const response = await signInUser(invalidUser)
		expect(response.body.message).toBe('Correo o contraseña incorrecta')
	})
})

describe('Create fav list', ()=>{
	it('Return "201 OK" when token is valid', async()=>{
		await postValidUser()
		const{body} = await signInUser()
		const response = await postFavList(body.token)
		expect(response.status).toBe(201)
	})
	it('Return "Fav created" when token is valid', async()=>{
		await postValidUser()
		const{body} = await signInUser()
		const response = await postFavList(body.token)
		expect(response.body.message).toBe('Fav created')
	})
	it('Saves the fav list when token is valid', async()=>{
		await postValidUser()
		const{body} = await signInUser()
		await postFavList(body.token)
		const userList = await User.find()
		expect(userList[0].favs.length).toBe(1)
	})
	it("Saves the favList's name when token is valid", async()=>{
		await postValidUser()
		const{body} = await signInUser()
		await postFavList(body.token)
		const userList = await User.find().populate('favs')
		const favsList = userList[0].favs[0]
		expect(favsList.name).toBe('ropa')
	})
	it('Return "403" status when token is invalid', async()=>{
		await postValidUser()
		await signInUser()
		const token = 'this-token-is-invalid'
		const response = await postFavList(token)
		expect(response.status).toBe(403)
	})

	it('Return "Unauthenticated" message when token is invalid', async()=>{
		await postValidUser()
		await signInUser()
		const token = 'this-token-is-invalid'
		const response = await postFavList(token)
		expect(response.body.error).toBe('Unauthenticated')
	})
})

describe("Delete favList", ()=>{
	it('Delete favList when token and id is valid', async()=>{
		await postValidUser()
		const{body} = await signInUser()
		const token = body.token
		await postFavList(token)
		const favsList = await Fav.find()
		const FavListId = favsList[0]._id
		await deteleFavList(FavListId, token)
		const userList = await User.find()
		expect(userList[0].favs.length).toBe(0)
	})

	it('Return "Unauthenticated" message when token is invalid', async()=>{
		await postValidUser()
		const{body} = await signInUser()
		const token = body.token
		await postFavList(token)
		const favsList = await Fav.find()
		const FavListId = favsList[0]._id
		const response = await deteleFavList(FavListId, 'this-token-is-invalid')
		expect(response.body.error).toBe('Unauthenticated')
	})

	it('Return "id inválido" message when id is invalid', async()=>{
		await postValidUser()
		const{body} = await signInUser()
		const token = body.token
		await postFavList(token)
		const response = await deteleFavList('this-id-is-invalid', token)
		expect(response.body.error).toBe('id inválido')
	})
})

describe("Get All FavList", ()=>{
	it('Return all FavList when token is valid', async()=>{
		await postValidUser()
		const{body} = await signInUser()
		const token = body.token
		await postFavList(token)
		const response = await getAllFavsList(token)
		const favs = response.body.favs
		expect(favs.length).toBe(1)
	})

	it('Return "Unauthenticated" message when token is invalid', async()=>{
		await postValidUser()
		const{body} = await signInUser()
		const token = body.token
		await postFavList(token)
		const response = await getAllFavsList('this-token-is-invalid')
		expect(response.body.error).toBe("Unauthenticated")
	})
})

describe("Get One FavList", ()=>{
	it('Return "Unauthenticated" message when token is invalid', async()=>{
		await postValidUser()
		const{body} = await signInUser()
		const token = body.token
		await postFavList(token)
		const favsList = await Fav.find()
		const FavListId = favsList[0]._id
		const response = await getOneFavsList('this-token-is-invalid', FavListId)
		expect(response.body.error).toBe('Unauthenticated')
	})

	it('Return "id inválido" message when id is invalid', async()=>{
		await postValidUser()
		const{body} = await signInUser()
		const token = body.token
		await postFavList(token)
		const response = await getOneFavsList(token, 'this-id-is-invalid')
		expect(response.body.error).toBe('id inválido')
	})

	it('Return FavList when token and id is valid', async()=>{
		await postValidUser()
		const{body} = await signInUser()
		const token = body.token
		await postFavList(token)
		const favsList = await Fav.find()
		const FavListId = favsList[0]._id
		const response = await getOneFavsList(token, FavListId)
		const Favs = response.body.Favs
		expect(Favs.name).toBe('ropa')
	})
})