import { conectar } from "../models/db_conectar.js";
var crud_estudiante = ({});

crud_estudiante.leer = (req, res) => {
    // Consulta para obtener los estudiantes con sus datos y el tipo de sangre asociado
    conectar.query(`SELECT e.id_estudiante, e.carne, e.nombres, e.apellidos, e.direccion, e.telefono, e.correo, 
                    t.sangre, e.fecha_nacimiento 
                    FROM estudiantes e 
                    LEFT JOIN tipos_sangre t 
                    ON e.id_tipo_sangre = t.id_tipo_sangre;`,
        (error, results) => {
            if (error) {
                throw error;
            } else {
                // Después de obtener los estudiantes, obtenemos los tipos de sangre
                conectar.query('SELECT id_tipo_sangre, sangre FROM tipos_sangre', (err, tiposSangreResults) => {
                    if (err) {
                        throw err;
                    } else {
                        // Renderizamos la vista pasando los estudiantes y los tipos de sangre
                        res.render('estudiantes/index', { 
                            resultado: results, // Lista de estudiantes
                            tiposSangre: tiposSangreResults // Lista de tipos de sangre
                        });
                    }
                });
            }
        }
    );
};

crud_estudiante.cud = (req,res)=>{
    const btn_agregar = req.body.btn_agregar;
    const btn_actualizar = req.body.btn_actualizar;
    const btn_borrar = req.body.btn_borrar;
    const id = req.body.txt_id_estudiante;
    const carne = req.body.txt_carne;
    const nombres = req.body.txt_nombres;
    const apellidos = req.body.txt_apellidos;
    const direccion = req.body.txt_direccion;
    const telefono = req.body.txt_telefono;
    const correo = req.body.txt_correo;
    const sangre = req.body.txt_id_sangre;
    const nacimiento = req.body.txt_nacimiento;

    if (btn_agregar){
        conectar.query('INSERT INTO estudiantes SET ?', {carne:carne, nombres:nombres, apellidos:apellidos, direccion:direccion, telefono:telefono, correo:correo, id_tipo_sangre:sangre, fecha_nacimiento:nacimiento}, (error,results)=>{
            if (error) {
                console.log(error);
            }else{
                res.redirect('/');
            }
        })
    }

    if (btn_actualizar) {
        conectar.query('UPDATE estudiantes SET ? WHERE id_estudiante = ?', [{carne:carne, nombres:nombres, apellidos:apellidos, direccion:direccion, telefono:telefono, correo:correo, id_tipo_sangre:sangre, fecha_nacimiento:nacimiento}, id], (error,results)=>{
            if (error) {
                console.log(error);
            }else {
                res.redirect('/');
            }
        })
        
    }

    if (btn_borrar) {
        conectar.query('DELETE FROM estudiantes WHERE id_estudiante = ?',[id], (error,results)=>{
            if (error) {
                console.log(error);
            }else {
                res.redirect('/');
            }
        })
    }
};

export {crud_estudiante}