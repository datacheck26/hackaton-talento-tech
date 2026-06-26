// ============================================================
// Datacheck AI — Matriz de Preguntas, Pesos y Contenido IA
// Basado en: Ley 1581 de 2012 — Protección de Datos Personales
// ============================================================

import type { Bloque, Pregunta } from './types';

// ----------------------------------------------------------
// BLOQUES TEMÁTICOS
// ----------------------------------------------------------
export const BLOQUES: Bloque[] = [
  {
    id: 'politica',
    titulo: 'Política de Datos Personales',
    descripcion: 'Existencia, documentación y publicación de la política de tratamiento de datos.',
    pesoMaximo: 40,
    color: 'emerald',
    icono: '📋',
  },
  {
    id: 'privacidad_disenio',
    titulo: 'Privacidad desde el Diseño',
    descripcion: 'Medidas técnicas de minimización, evaluaciones de impacto y configuración por defecto.',
    pesoMaximo: 36,
    color: 'teal',
    icono: '🔒',
  },
  {
    id: 'gobernanza',
    titulo: 'Gobernanza y Control',
    descripcion: 'Sistemas de administración de riesgos y responsable de protección de datos.',
    pesoMaximo: 24,
    color: 'cyan',
    icono: '⚖️',
  },
];

// ----------------------------------------------------------
// PREGUNTAS — BLOQUE 1: Política de Datos Personales (40%)
// ----------------------------------------------------------
export const PREGUNTAS: Pregunta[] = [
  {
    id: 'Q1',
    numero: 1,
    bloqueId: 'politica',
    texto: '¿Cuenta su organización con una política de tratamiento de datos personales formalmente establecida?',
    peso: 0, // La Q1 es la llave maestra — su peso es heredado (controla Q2-Q5)
    esComplementaria: false,
    esLlaveMaestra: true,
    articuloLegal: 'Art. 13 y 17, Ley 1581/2012',
    textoLegal:
      'Los responsables del tratamiento deberán adoptar una política de tratamiento de la información, la cual deberá ser informada a los titulares antes de recolectar sus datos personales.',
    consejoCopilot:
      '**Acción inmediata:** Redacte un documento formal llamado "Política de Tratamiento de Datos Personales". Este es el punto de partida obligatorio. Sin él, ningún otro requisito legal puede cumplirse. Puede comenzar con una plantilla de 1-2 páginas que cubra quién recopila datos, para qué, y cómo se protegen.',
    ejemploPractico:
      'Una empresa de e-commerce debe publicar su política antes de que cualquier usuario cree una cuenta. El texto debe ser claro, no en "letra pequeña", y accesible desde la página principal.',
  },
  {
    id: 'Q2',
    numero: 2,
    bloqueId: 'politica',
    texto: '¿La política de tratamiento de datos está documentada y publicada en un medio de fácil acceso para los titulares?',
    peso: 10,
    esComplementaria: false,
    esLlaveMaestra: false,
    dependeDe: 'Q1',
    articuloLegal: 'Art. 13(b) y 26, Ley 1581/2012',
    textoLegal:
      'La política de tratamiento estará disponible a los titulares de la información en los canales habilitados por el responsable del tratamiento para la atención al público, así como en la página web o en el portal de Internet del responsable.',
    consejoCopilot:
      '**¿Dónde publicarla?** La ley exige que sea "fácil acceso". Esto significa: un enlace visible en el footer de su sitio web, un aviso en sus formularios de registro, y/o un documento físico disponible en sus instalaciones. No es suficiente tenerla en un cajón de oficina.',
    ejemploPractico:
      'Sitios como Bancolombia, Rappi y cualquier plataforma seria tienen un enlace "Política de Privacidad" en el pie de página. Si no puede mostrarle a un usuario dónde está su política en menos de 10 segundos, no cumple este requisito.',
  },
  {
    id: 'Q3',
    numero: 3,
    bloqueId: 'politica',
    texto: '¿La política define claramente las finalidades del tratamiento de los datos personales recopilados?',
    peso: 10,
    esComplementaria: false,
    esLlaveMaestra: false,
    dependeDe: 'Q1',
    articuloLegal: 'Art. 13(a) y 17(b), Ley 1581/2012',
    textoLegal:
      'Las finalidades del tratamiento, si son varias, se expresarán de forma clara y suficiente; al titular se le informará cuáles datos son o no voluntarios y las consecuencias de no suministrar la información.',
    consejoCopilot:
      '**Sea específico sobre el "para qué":** No es suficiente decir "para mejorar el servicio". Debe indicar explícitamente: "Los datos de contacto se usan para enviar confirmaciones de pedido y, con su autorización, boletines de ofertas". Cada finalidad diferente requiere una mención separada.',
    ejemploPractico:
      'Si recopila el correo electrónico, defina si es para: (1) transacciones, (2) marketing, (3) análisis internos. Un cliente tiene derecho a consentir para unos usos y no para otros.',
  },
  {
    id: 'Q4',
    numero: 4,
    bloqueId: 'politica',
    texto: '¿La política incluye de forma explícita los derechos de los titulares de los datos (acceso, corrección, supresión, etc.)?',
    peso: 10,
    esComplementaria: false,
    esLlaveMaestra: false,
    dependeDe: 'Q1',
    articuloLegal: 'Art. 8 y 13(e), Ley 1581/2012',
    textoLegal:
      'Los titulares de datos personales tienen derecho a: conocer, actualizar y rectificar sus datos; solicitar prueba de la autorización otorgada; ser informados sobre el uso de sus datos; revocar la autorización; y presentar quejas ante la Superintendencia de Industria y Comercio.',
    consejoCopilot:
      '**Los titulares tienen 6 derechos fundamentales** que DEBE mencionar en su política: (1) Conocer sus datos, (2) Actualizarlos, (3) Rectificarlos, (4) Revocar el consentimiento, (5) Solicitar prueba del consentimiento dado, y (6) Quejarse ante la SIC. Si falta alguno, su política está incompleta.',
    ejemploPractico:
      'Agregue una sección "Sus Derechos como Titular" con estos 6 puntos en lenguaje simple. Ejemplo: "Usted tiene el derecho a solicitarnos en cualquier momento que eliminemos sus datos de nuestras bases de datos".',
  },
  {
    id: 'Q5',
    numero: 5,
    bloqueId: 'politica',
    texto: '¿La política establece el procedimiento para que los titulares ejerzan sus derechos (canales, tiempos de respuesta)?',
    peso: 10,
    esComplementaria: false,
    esLlaveMaestra: false,
    dependeDe: 'Q1',
    articuloLegal: 'Art. 14 y 22, Ley 1581/2012',
    textoLegal:
      'Los responsables del tratamiento están obligados a atender las consultas y reclamos de los titulares dentro de los plazos previstos en la ley: 10 días hábiles para consultas y 15 días hábiles para reclamos, prorrogables por 8 días más con aviso al titular.',
    consejoCopilot:
      '**No basta decir que los derechos existen; hay que decir CÓMO ejercerlos.** Incluya: un correo de contacto dedicado (ej: datospersonales@suempresa.com), el plazo de respuesta (10 días hábiles para consultas, 15 para reclamos según la ley), y el formulario o proceso a seguir.',
    ejemploPractico:
      '"Para ejercer sus derechos, escríbanos a privacidad@empresa.com con el asunto \'Solicitud de Datos\'. Responderemos en un máximo de 10 días hábiles." Esto es todo lo que necesita para cumplir este punto.',
  },

  // ----------------------------------------------------------
  // PREGUNTAS — BLOQUE 2: Privacidad desde el Diseño (36%)
  // ----------------------------------------------------------
  {
    id: 'Q6',
    numero: 6,
    bloqueId: 'privacidad_disenio',
    texto: '¿Su organización incorpora evaluaciones de impacto de privacidad (Privacy Impact Assessments - PIAs) en el diseño de nuevos productos, servicios o procesos?',
    peso: 12,
    esComplementaria: false,
    esLlaveMaestra: false,
    articuloLegal: 'Art. 4(g), Ley 1581/2012 + ISO/IEC 29134',
    textoLegal:
      'El principio de seguridad exige adoptar las medidas técnicas, humanas y administrativas necesarias para otorgar seguridad a los registros, evitando su adulteración, pérdida, consulta, uso o acceso no autorizado o fraudulento.',
    consejoCopilot:
      '**Un PIA no es un trámite burocrático, es una herramienta de negocio.** Antes de lanzar un nuevo producto digital o proceso interno que maneje datos personales, haga una reunión de 1 hora con el equipo de TI, legal y operaciones para responder: ¿Qué datos recopilamos? ¿Son necesarios? ¿Qué pasa si los hackean? Documente el resultado en una hoja de cálculo.',
    ejemploPractico:
      'Al diseñar una nueva app de fidelización que registra ubicación del cliente, un PIA detectaría que la geolocalización es un dato sensible, que se debe pedir permiso explícito, y que se debe cifrar en reposo.',
  },
  {
    id: 'Q7',
    numero: 7,
    bloqueId: 'privacidad_disenio',
    texto: '¿Aplica técnicas de minimización de datos, recopilando únicamente la información estrictamente necesaria para el fin declarado?',
    peso: 12,
    esComplementaria: false,
    esLlaveMaestra: false,
    articuloLegal: 'Art. 4(c), Ley 1581/2012 — Principio de Finalidad',
    textoLegal:
      'El tratamiento debe obedecer a una finalidad legítima de acuerdo con la Constitución y la Ley, la cual debe ser informada al titular. Está prohibido recolectar datos sin una finalidad clara, determinada y legítima.',
    consejoCopilot:
      '**Menos es más en protección de datos.** Revise cada campo de sus formularios y pregúntese: "¿Realmente necesitamos esto para el servicio?" Si pide fecha de nacimiento completa solo para desear "Feliz cumpleaños", con el mes y día es suficiente. Eliminar campos innecesarios reduce su riesgo legal y mejora la conversión.',
    ejemploPractico:
      'Una tienda online no necesita el número de cédula para procesar un pedido. Si lo está pidiendo, está violando el principio de minimización. Solo pídalo si hay una razón legal específica (ej: facturación electrónica).',
  },
  {
    id: 'Q8',
    numero: 8,
    bloqueId: 'privacidad_disenio',
    texto: '¿Sus sistemas y aplicaciones están configurados por defecto para recopilar el mínimo de datos posible (Privacy by Default)?',
    peso: 12,
    esComplementaria: false,
    esLlaveMaestra: false,
    articuloLegal: 'Art. 4(g), Ley 1581/2012 — Principio de Seguridad + GDPR Art. 25',
    textoLegal:
      'Deben adoptarse las medidas técnicas necesarias que garanticen la seguridad de los datos personales, impidiendo su adulteración, pérdida, consulta, uso o acceso no autorizado.',
    consejoCopilot:
      '**Privacy by Default significa que la configuración más privada es la predeterminada.** Sus sistemas NO deben recopilar datos opcionales sin permiso explícito. Las notificaciones de marketing, el rastreo de comportamiento, el compartir datos con terceros: todo debe estar DESACTIVADO por defecto. El usuario activa lo que quiere compartir, no al revés.',
    ejemploPractico:
      'Si tiene una plataforma con perfil de usuario, el campo "compartir mi perfil públicamente" debe venir marcado como NO por defecto. El usuario decide activarlo. Esto es Privacy by Default en la práctica.',
  },

  // ----------------------------------------------------------
  // PREGUNTAS — BLOQUE 3: Gobernanza (24%)
  // ----------------------------------------------------------
  {
    id: 'Q9',
    numero: 9,
    bloqueId: 'gobernanza',
    texto: '¿Su organización cuenta con un sistema o programa de administración de riesgos relacionados con el tratamiento de datos personales?',
    peso: 16,
    esComplementaria: false,
    esLlaveMaestra: false,
    articuloLegal: 'Art. 17(i), Ley 1581/2012',
    textoLegal:
      'Los responsables del tratamiento deben adoptar un manual interno de políticas y procedimientos para garantizar el adecuado cumplimiento de la ley y, en especial, para la atención de consultas y reclamos.',
    consejoCopilot:
      '**Un sistema de riesgos no debe ser complejo.** Puede empezar con un documento sencillo que liste: (1) Los activos de datos que maneja (bases de datos, formularios, CRM), (2) Las amenazas posibles (hackeo, error humano, fuga), (3) Las medidas de control actuales, y (4) Un plan de acción si algo falla. Revíselo cada 6 meses.',
    ejemploPractico:
      'Una empresa con 500 clientes en un CRM debería tener: contraseñas robustas, acceso solo para quien necesite los datos, un backup semanal, y un plan de comunicación si los datos se filtran (notificar a clientes en 72 horas, como exige la buena práctica).',
  },
  {
    id: 'Q10',
    numero: 10,
    bloqueId: 'gobernanza',
    texto: '¿Su organización cuenta con un oficial o responsable de protección de datos personales (DPO o figura equivalente)?',
    peso: 8,
    esComplementaria: false,
    esLlaveMaestra: true,
    articuloLegal: 'Art. 17(k), Ley 1581/2012',
    textoLegal:
      'Los responsables del tratamiento deberán designar a las personas responsables de atender las peticiones, consultas y reclamos ante los cuales el titular del dato podrá ejercer sus derechos.',
    consejoCopilot:
      '**No se necesita contratar a alguien nuevo.** Una persona de su equipo (puede ser el gerente, el jefe de TI, o alguien de RRHH) puede asumir este rol de forma adicional a sus funciones. Lo importante es que esté designado formalmente y que los empleados y clientes sepan a quién acudir con dudas sobre sus datos.',
    ejemploPractico:
      'Asigne formalmente a "María González, Jefe de Tecnología" como responsable de datos. Publique su correo de contacto en la política de privacidad. Esto cumple el requisito sin contratar a nadie externo.',
  },
  {
    id: 'Q11',
    numero: 11,
    bloqueId: 'gobernanza',
    texto: '¿El oficial de protección de datos está formalmente designado (acta, contrato, resolución interna u otro documento oficial)?',
    peso: 0, // Pregunta complementaria — no suma al score
    esComplementaria: true,
    esLlaveMaestra: false,
    dependeDe: 'Q10',
    articuloLegal: 'Art. 17(k) y 26, Ley 1581/2012',
    textoLegal:
      'La designación del responsable de atención al titular debe constar en documentos internos de la organización y debe comunicarse apropiadamente.',
    consejoCopilot:
      '**Esta es la diferencia entre "decirlo" y "hacerlo oficial".** Una simple acta firmada por el representante legal designando al responsable de datos es suficiente. Guárdela en el expediente de la empresa. Si la SIC hace una auditoría, usted debe poder mostrar este documento.',
    ejemploPractico:
      '"Por medio del presente documento, se designa a [Nombre] como Oficial de Protección de Datos Personales de [Empresa], con vigencia a partir de [Fecha]. Firmado: [Representante Legal]." Ese documento de media página es todo lo que necesita.',
  },
];

// ----------------------------------------------------------
// Helpers de consulta
// ----------------------------------------------------------

export function getPreguntaById(id: string): Pregunta | undefined {
  return PREGUNTAS.find((p) => p.id === id);
}

export function getPreguntasByBloque(bloqueId: string): Pregunta[] {
  return PREGUNTAS.filter((p) => p.bloqueId === bloqueId);
}

export function getBloqueById(id: string): Bloque | undefined {
  return BLOQUES.find((b) => b.id === id);
}
