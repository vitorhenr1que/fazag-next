import { prisma } from "../../../services/prisma";
import { NextApiRequest, NextApiResponse } from "next";

const VAGAS_ID = 'b90b0686-f9fa-4d3f-a8f9-35c5223346fa';

const vagasCourses = [
    'administracao',
    'ciencias_contabeis',
    'educacao_fisica_bacharelado',
    'educacao_fisica_licenciatura',
    'enfermagem',
    'engenharia_civil',
    'estetica',
    'farmacia',
    'fisioterapia',
    'nutricao',
    'pedagogia',
    'psicologia',
    'servico_social',
    'odontologia',
    'fonoaudiologia',
    'direito',
] as const;

type VagasCourse = typeof vagasCourses[number];

function isVagasCourse(course: string): course is VagasCourse {
    return vagasCourses.includes(course as VagasCourse);
}

function buildSelect(course: unknown) {
    if (typeof course === 'string' && isVagasCourse(course)) {
        return { [course]: true };
    }

    if (course && typeof course === 'object') {
        const select = Object.entries(course).reduce((acc, [key, shouldSelect]) => {
            if (shouldSelect && isVagasCourse(key)) {
                acc[key] = true;
            }

            return acc;
        }, {} as Partial<Record<VagasCourse, true>>);

        if (Object.keys(select).length > 0) {
            return select;
        }
    }

    return null;
}

function buildUpdateData(value: unknown) {
    if (!value || typeof value !== 'object') {
        return null;
    }

    const updateData = Object.entries(value).reduce((acc, [key, quantity]) => {
        const parsedQuantity = typeof quantity === 'string' ? Number(quantity) : quantity;

        if (isVagasCourse(key) && typeof parsedQuantity === 'number' && Number.isInteger(parsedQuantity)) {
            acc[key] = parsedQuantity;
        }

        return acc;
    }, {} as Partial<Record<VagasCourse, number>>);

    if (Object.keys(updateData).length > 0) {
        return updateData;
    }

    return null;
}

export default async function (req: NextApiRequest, res: NextApiResponse){
    const data = req.body
    const select = buildSelect(data.course);
    const updateData = buildUpdateData(data.value);

    if (!select || !updateData) {
        return res.status(400).json({ error: 'Curso ou valor invalido para alteracao de vagas.' });
    }

    const setNumberVencace = await prisma.vagas.update({
        where: {
            id: VAGAS_ID
        },
        select: select as any,
        data: updateData
    })

    return res.status(200).json({setNumberVencace})
}
