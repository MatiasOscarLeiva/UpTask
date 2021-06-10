import Swal from 'sweetalert2';
import axios from 'axios';

import { actualizarAvance } from '../funciones/avance';

const tareas = document.querySelector('.listado-pendientes');

if (tareas) {

    tareas.addEventListener('click', e => {

        if (e.target.classList.contains('fa-check-circle')) {

            const icono = e.target;
            const tareaId = icono.parentElement.parentElement.dataset.tarea;

            const url = `${location.origin}/tareas/${tareaId}`;
            console.log(url)
            axios.patch(url, { tareaId })
                .then(function (respuesta) {
                    if (respuesta.status === 200) {
                        icono.classList.toggle('completo')

                        actualizarAvance();
                    }

                })
        }


        if (e.target.classList.contains('fa-trash')) {
            const tareaHTML = e.target.parentElement.parentElement;
            const tareaId = tareaHTML.dataset.tarea;

            Swal.fire({
                title: '¿Deseas borrar esta Tarea?',
                text: "Una tarea eliminada no se puede recuperar.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, Eliminala!',
                cancelButtonText: 'No, Cancelar'
            }).then((result) => {
                if (result.isConfirmed) {

                    const url = `${location.origin}/tareas/${tareaId}`;

                    axios.delete(url, { params: { tareaId } })
                        .then((respuesta) => {

                            if (respuesta.status === 200) {

                                tareaHTML.parentElement.removeChild(tareaHTML);

                                Swal.fire(
                                    '¡Tarea Eliminada!',
                                    respuesta.data,
                                    'success'
                                );

                                actualizarAvance();
                            }

                        })
                        .catch(() => {
                            Swal.fire(

                                'Hubo un error',
                                'No se pudo eliminar la tarea',
                                'error'
                            )
                        })
                }
            })
        }
    });
}

export default tareas;