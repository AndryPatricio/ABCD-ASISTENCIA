import { PrismaClient } from '../generated/prisma/client';



const prisma = new PrismaClient();

const createRoles = async () => {
	const roles = [
		{ nombre: 'Administrador' },
		{ nombre: 'Empleado' },
	];

	for (const role of roles) {
		await prisma.rol.create({
			data: role,
		});
	}
}

const createDias = async () => {
	const dias = [
		{ nombre: 'Lunes' },
		{ nombre: 'Martes' },
		{ nombre: 'Miércoles' },
		{ nombre: 'Jueves' },
		{ nombre: 'Viernes' },
		{ nombre: 'Sábado' },
		{ nombre: 'Domingo' },
	];

	for (const dia of dias) {
		await prisma.dia.create({
			data: dia,
		});
	}
}

const createTipoEventos = async () => {
	const tiposEventos = [
		{ nombre: 'Inicia turno' },
		{ nombre: 'Inicia comida' },
		{ nombre: 'Fin comida' },
		{ nombre: 'Fin turno' },
	];

	for (const tipoEvento of tiposEventos) {
		await prisma.tiposEventos.create({
			data: tipoEvento,
		});
	}
}
	

async function main() {
	await createRoles();

	await createDias();

	await createTipoEventos();
}

main()
	.then(async () => {
		await prisma.$disconnect();
	})
	.catch(async (e) => {
		console.error(e);
		await prisma.$disconnect();
		process.exit(1);
	});