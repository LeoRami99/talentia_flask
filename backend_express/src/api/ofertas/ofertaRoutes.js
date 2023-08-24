const express = require('express');
const router = express.Router();
const OfertaDB = require("./clase/OfertaDB");

router.post("/create-empresa", async (req, res) => {
    try{
        const {nombre, direccion, telefono, website, id_usuario} = req.body;
        const empresa = new OfertaDB(nombre, direccion, telefono, website, id_usuario);
        const empresa_id = await empresa.createEmpresa();
        res.status(200).json(
            {
                "message": "Empresa creada exitosamente",
                "id_empresa": empresa_id,
                "status": 200
            }
        );
    }catch(error){
        res.status(500).json({error: error.message});
    }
})

router.post("/create-oferta", async (req, res) => {
    try {
        const {
            id_empresa, nombre_oferta, descripcion_oferta, fecha_publicacion, 
            fecha_cierre, salario, tipo_contrato, modalidad, requisitos, 
            url_referencia, pais, ciudad, habilidades, estado
        } = req.body;

        const oferta = new OfertaDB();

        const oferta_id = await oferta.createOferta(
            id_empresa,
            nombre_oferta,
            descripcion_oferta,
            convertToMySQLFormat(fecha_publicacion),
            fecha_cierre,
            salario,
            tipo_contrato,
            modalidad,
            url_referencia,
            ciudad,
            pais,
            requisitos,
            estado
        );

        const habilidadesPromises = habilidades.map(habilidad => 
            oferta.crearHabilidadOferta(oferta_id, habilidad.id)
        );

        await Promise.all(habilidadesPromises);

        res.status(200).json({
            message: "Oferta creada exitosamente",
            id_oferta: oferta_id,
            status: 200
        });
        
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Hubo un error al crear la oferta",
            error: error.message,
            status: 500
        });
    }
});

function convertToMySQLFormat(isoString) {
    return isoString.slice(0, 19).replace('T', ' ');
}

// habilidades lista
router.get("/habilidades", async (req, res) => {
    try {
        const oferta = new OfertaDB();
        const habilidades = await oferta.getHabilidades();
        res.status(200).json({"message": "Habilidades obtenidas exitosamente", "habilidades": habilidades, "status": 200});
    } catch (error) {
        res.status(500).json({"error": error.message});
    }
});
router.get("/empresa/:id_usuario", async (req, res) => {
    try {
        const oferta = new OfertaDB();
        const empresa = await oferta.getEmpresaByIdUsuario(req.params.id_usuario);
        res.status(200).json({"message": "Empresa obtenida exitosamente", "empresa": empresa, "status": 200});
    } catch (error) {
        res.status(500).json({"error": error.message});
    }
});
router.get("/ofertas", async (req, res) => {
    try{
        const oferta = new OfertaDB();
        const ofertas = await oferta.getOfertas();
        res.status(200).json({"message": "Ofertas obtenidas exitosamente", "ofertas": ofertas, "status": 200});
    }catch{
        res.status(500).json({"error": error.message});
    }
})


module.exports = router;