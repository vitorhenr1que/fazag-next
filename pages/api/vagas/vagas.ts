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

export default async function (req: NextApiRequest, res: NextApiResponse){
    const  {course}  = req.body
    const select = buildSelect(course);

    if (!select) {
        return res.status(400).json({ error: 'Curso invalido para consulta de vagas.' });
    }

    const getNumberVencace = await prisma.vagas.findUnique({
        where: {
            id: VAGAS_ID
        },
        select: select as any
    })


    return res.status(200).json({getNumberVencace})
}
