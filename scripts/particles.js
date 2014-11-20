var g_explosions = [];
function particle(_x, _y, _r, _dX, _dY, _colour)
{
    // Private
    // =======
    var x = _x,
        y = _y,
        r = _r,
        // dX and dY are X and Y velocity, respectively
        dX = _dX,
        dY = _dY,
        colour = _colour,
        alpha = 0.3 + Math.random() * 0.5;
    // degrade is the magnitude by which alpha and size changes
    // each tick
    var degrade = -0.01;

    // Public
    // ======
    var res = {};
    res.update = function(growth)
    {
        x += (dX + Math.random()/10);
        y += (dY + Math.random()/10);
        alpha += degrade;
        
        // Calculate new radius
        if (growth)
            var nr = r - (degrade * 2);
        else
        {
            var nr = r + (degrade * 2);
            // Add gravity
            dY -= degrade * 5;
        }

        if (nr > 0) r = nr;
    };
    res.render = function(ctx)
    {
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI*2, false);
        ctx.fillStyle = 'rgba('+ colour +', ' + alpha + ')';
        ctx.fill();
    };
    res.getAlpha = function()
    {
        return alpha;
    };
    return res;
}


function halo(_colour)
{
    // Private
    // =======
    var colour = _colour,
        particles = [];

    // Public
    // ======
    res = {};
    res.spawnParticle = function(x, y)
    {
        // We randomize the velocity vector of the particles to make
        // them look more natural.
        velX = (Math.random() < 0.5) ? Math.random() : - Math.random();
        velY = (Math.random() < 0.5) ? Math.random() : - Math.random();
        particles.push(particle(x, y, 1 + Math.random()*2, velX, velY, colour));
    };
    res.update = function(x, y)
    {
        this.spawnParticle(x, y);

        for (var i = 0; i < particles.length;)
        {
            particles[i].update(false);
            // We allow particles to be garbage collected when they have
            // faded almost completely
            if (particles[i].getAlpha() < 0.05)
                particles.splice(i, 1);
            else
                ++i;
        }
    };
    res.render = function(ctx)
    {
        for (var i = 0; i < particles.length; ++i)
        {
            particles[i].render(ctx);
        }
    };

    res.explode = function(x,y)
    {
        var n = 50;
        for (var i=0; i<n; i++)
        {
            spawnExplosionParticle(x,y);
        }

    }

    spawnExplosionParticle = function(x, y)
    {
        // We randomize the velocity vector of the particles to make
        // them look more natural.
        velX = (Math.random() < 0.5) ? Math.random() : - Math.random();
        velY = (Math.random() < 0.5) ? Math.random() : - Math.random();
        var pColour = util.generateColors();
        var colorString = pColour.result.r +','+ pColour.result.g + ',' + pColour.result.b; 
        particles.push(particle(x, y, 1 + Math.random()*2, velX, velY, colorString));
    };


    return res;
}