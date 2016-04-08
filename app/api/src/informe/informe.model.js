(function() {
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var InformeSchema = new Schema({
    informeCampoDetails: {
        idTanque: String,
        cit: String,
        fechaHora: Date,
        syncTime: String,
        operador: String,
        inspector: String,
        calle: String,
        localidad: String,
        provincia: String,
        tipoTanque: String,
        tipoInspeccion: String,
        volumen: String,
        entidadAuditora: String,
        anoFabricacion: String,
        orientacionLadoA: String,
        orientacionLadoB: String
    },

    primeraSeccion: {
        perimetro: Number,
        altura: Number,
        tienePlacaTk: Boolean,
        tieneNumero: Boolean,
        tieneCapacidadNominal: Boolean,
        tieneProductoAlmacenado: Boolean,
        tieneLogoOperador: Boolean,
        tieneHormigonArmado: Boolean,
        tieneIdentificadorRiesgo: Boolean,
        tieneCartaConversion: Boolean,
        tienePestaniaPiso: Boolean,
        tieneTalonBituminoso: Boolean,
        tieneAnclajes: Boolean,
        tieneMamposteria: Boolean,
        tieneAceroHierro: Boolean,
        tieneNumeroObservaciones: String,
        tienePlacaTkObservaciones: String,
        tieneIdentificadorRiesgoObservaciones: String,
        tieneCartaConversionObservaciones: String,
        tieneProductoAlmacenadoObservaciones: String,
        tieneCapacidadNominalObservaciones: String,
        tieneLogoOperadorObservaciones: String,
        tienePestaniaPisoObservaciones: String,
        tieneTalonBituminosoObservaciones: String,
        tieneHormigonArmadoObservaciones: String,
        tieneAnclajesObservaciones: String,
        alturaObservaciones: String,
        perimetroObservaciones: String,
        mamposteriaObservaciones: String,
        aceroHierroObservaciones: String
    },
    segundaSeccion: {
        tieneSoldaduras: Boolean,
        tieneGlobos: Boolean,
        tieneMedidorNivelPared: Boolean,
        tieneBocaLimpieza: Boolean,
        tieneBocaHombre: Boolean,
        tieneHundimientos: Boolean,
        tieneSuccion: Boolean,
        tieneCarga: Boolean,
        tieneDrenaje: Boolean,
        tieneTelemedicion: Boolean,
        tienePintura: Boolean,
        metodoCalefaccion: String,
        tienePinturaObservaciones: String,
        tieneTelemedicionObservaciones: String,
        tieneDrenajeObservaciones: String,
        tieneCargaObservaciones: String,
        tieneSuccionObservaciones: String,
        tieneMedidorNivelParedObservaciones: String,
        tieneBocaHombreObservaciones: String,
        tieneBocaLimpiezaObservaciones: String,
        tieneHundimientosObservaciones: String,
        tieneGlobosObservaciones: String,
        tieneSoldadurasObservaciones: String,
        cantidadChapasVirola: Number,
        cantidadVirolas: Number
    },
    terceraSeccion: {
        tieneTecho: Boolean,
        tipoTecho: String,
        tieneChapasTecho: Boolean,
        tieneSellos: Boolean,
        tieneRespiradores: Boolean,
        tieneBocaHombreTecho: Boolean,
        tieneMedidorNivel: Boolean,
        tieneCanieria: Boolean,
        tieneVenteos: Boolean,
        tieneValvulas: Boolean,
        tieneSuccion: Boolean,
        tieneControlNivel: Boolean,
        tieneTelemedicion: Boolean,
        succionObservaciones: String,
        controlNivelObservaciones: String,
        tieneBarandaPerimetral: String,
        pinturaObservaciones: String,
        tipoTechoObservaciones: String,
        chapasTechoObservaciones: String,
        sellosObservaciones: String,
        respiradoresObservaciones: String,
        bocaHombreTechoObservaciones: String,
        medidorNivelObservaciones: String,
        canieriaObservaciones: String,
        venteosObservaciones: String,
        valvulasObservaciones: String,
        telemedicionObservaciones: String,
        tieneProteccionCatodica: Boolean,
        tieneTomasTierra: Boolean,
        tienePararrayos: Boolean,
        proteccionCatodicaObservaciones: String,
        tomasTierraObservaciones: String,
        pararrayosObservaciones: String,
        tieneChapasPiso: Boolean,
        tieneFlujoMagnetico: Boolean,
        tieneEmisionAcustica: Boolean,
        chapasPisoObservaciones: String,
        flujoMagneticoObservaciones: String,
        emisionAcusticaObservaciones: String,
        tienePoncho: Boolean,
        ponchoObservaciones: String,
        tienePintura: Boolean,
        tieneSuccionA: Boolean,
        tieneSuccionB: Boolean,
        tieneMedidorNivelA: Boolean,
        tieneMedidorNivelB: Boolean,
        tieneCargaB: Boolean,
        medidorNivelAObservaciones: String,
        medidorNivelBObservaciones: String,
        succionAObservaciones: String,
        succionBObservaciones: String,
        cargaBObservaciones: String,
        tieneBocaMedicion: Boolean,
        bocaMedicionObservaciones: String
    },
    cuartaSeccion: {
        tienePlataforma: Boolean,
        tienePeldanios: Boolean,
        tieneMetodoRecuperacion: Boolean,
        tieneDescansos: Boolean,
        tieneBaranda: Boolean,
        plataformaObservaciones: String,
        peldaniosObservaciones: String,
        descansosObservaciones: String,
        tieneBarandaObservaciones: String,
        tieneRecintoCompartido: Boolean,
        tieneDrenajesRecinto: Boolean,
        tieneIluminacionRecinto: Boolean,
        largoRecinto: Number,
        anchoRecinto: Number,
        altoRecinto: Number,
        recintoCompartidoObservaciones: String,
        recintoIluminacionObservaciones: String,
        recintoDrenajesObservaciones: String,
        metodoRecuperacionObservaciones: String,
        tieneRampas: Boolean,
        cantidadRampas: Number,
        tieneRampaPasarela: Boolean,
        tieneRampaEscalones: Boolean,
        tieneRampaIluminacion: Boolean,
        rampaCantidadObservaciones: String,
        rampaPasarelaObservaciones: String,
        tieneRampaEscalonesObservaciones: String,
        tieneRampaIluminacionObservaciones: String
    },
    quintaSeccion: {
        tieneFlotante: Boolean,
        tieneAlambre: Boolean,
        tieneGuiasAlambre: Boolean,
        flotanteObservaciones: String,
        alambreObservaciones: String,
        tieneGuiasAlambreObservaciones: String,
        tieneMantenimientoTanque: Boolean,
        tieneMantenimientoCanierias: Boolean,
        tieneMantenimientoRecinto: Boolean,
        tieneInpeccionesAnteriores: Boolean,
        mantenimientoTanqueObservaciones: String,
        mantenimientoCanieriasObservaciones: String,
        mantenimientoRecintoObservaciones: String,
        tieneInspeccionesAnterioresObservaciones: String,
        tipoInspeccion: String,
        caracteristicaTanque: String,
        latitud: Number,
        longitud: Number
    },
    sextaSeccion: {
        tieneExtintores10K: Boolean,
        tieneExtintores50K: Boolean,
        tieneEspumigeno: Boolean,
        tieneRociadores: Boolean,
        tieneHidrantes: Boolean,
        tieneLanzas: Boolean,
        tieneBaldes: Boolean,
        tieneServicioPropioBomberos: Boolean,
        extintores10KObservaciones: String,
        extintores50KObservaciones: String,
        espumigenoObservaciones: String,
        rociadoresObservaciones: String,
        hidrantesObservaciones: String,
        lanzasObservaciones: String,
        servicioPropioBomberosObservaciones: String,
        baldesObservaciones: String,
        extintores10KClase: String,
        extintores50KClase: String,
        extintores10KCantidad: Number,
        lanzasCantidad: Number,
        extintores50KCantidad: Number,
        rociadoresCantidad: Number,
        espumigenoCantidad: Number,
        hidrantesCantidad: Number,
        extintores10KClaseObservaciones: String,
        extintores50KClaseObservaciones: String,
        extintores10KCantidadObservaciones: String,
        extintores50KCantidadObservaciones: String,
        observacionesGenerales: String,
        lanzasCantidadObservaciones: String,
        espumigenoCantidadObservaciones: String,
        rociadoresCantidadObservaciones: String,
        hidrantesCantidadObservaciones: String
    },
    active: {
        type: Boolean,
        default: true
    },
    empresa: {
        type: Schema.Types.ObjectId,
        ref: 'Empresa'
    },
    codigoEmpresa: {
        type: String,
        uppercase: true
    },
    ordenCompra: String,
    contrato: String,
    asentamientoDetails: {
        moduloElastico: Number,
        tensionFluencia: Number,
        distanciaEntrePuntos: Number,
        defleccionPermitida: Number,
        defleccionMedida: Number,
        factorK: Number,
        defleccionPermitida2: Number,
        defleccionMedida2: Number,
        sarcCurva1: Number,
        sarcCurva2: Number,
        sarcCurva3: Number,
        defleccionMedidaCurva1: Number,
        defleccionMedidaCurva2: Number,
        defleccionMedidaCurva3: Number,
        medInicialCurva1: Number,
        medMinimoCurva1: Number,
        medFinalCurva1: Number,
        disInicialCurva1: Number,
        disMinimoCurva1: Number,
        disFinalCurva1: Number,
        medInicialCurva2: Number,
        medMinimoCurva2: Number,
        medFinalCurva2: Number,
        disInicialCurva2: Number,
        disMinimoCurva2: Number,
        disFinalCurva2: Number,
        medInicialCurva3: Number,
        medMinimoCurva3: Number,
        medFinalCurva3: Number,
        disInicialCurva3: Number,
        disMinimoCurva3: Number,
        disFinalCurva3: Number
    },
    espesoresDetails: {
        densidadProducto: Number
    }
});
InformeSchema.plugin(autoIncrement.plugin, {
    model: 'Informe',
    field: 'sequence',
    startAt: 1
});
module.exports = mongoose.model('Informe', InformeSchema);
}());
