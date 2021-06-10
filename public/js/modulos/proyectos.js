import Swal from 'sweetalert2';
import axios from 'axios';

const btnEliminar = document.querySelector('#eliminar-proyecto');

if (btnEliminar) {

    btnEliminar.addEventListener('click', e => {

        const urlProyecto = e.target.dataset.proyectoUrl;

        Swal.fire({
            title: '¿Deseas borrar este proyecto?',
            text: "Un proyecto eliminado no se puede recuperar.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminalo!',
            cancelButtonText: 'No, Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {

                const url = `${location.origin}/proyectos/${urlProyecto}`;

                axios.delete(url, { params: { urlProyecto } })
                    .then(() => {

                        Swal.fire(
                            '¡Proyecto Eliminado!',
                            'El proyecto se ha eliminado correctamente.',
                            'success'
                        );

                        setTimeout(() => {
                            window.location.href = '/';
                        }, 3000);
                    })
                    .catch(() => {
                        Swal.fire(

                            'Hubo un error',
                            'No se pudo eliminar el proyecto',
                            'error'
                        )
                    })
            }
        })
    });

}

export default btnEliminar;