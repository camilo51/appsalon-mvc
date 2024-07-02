<div class="campo">
    <label for="nombre">Nombre</label>
    <input type="text" id="nombre" name="nombre" placeholder="Nombre Servicio" value="<?= s($servicio->nombre) ?>" />
</div>

<div class="campo">
    <label for="precio">Precio</label>
    <input type="number" id="precio" name="precio" placeholder="Precio Servicio" value="<?= s($servicio->precio) ?>" />
</div>