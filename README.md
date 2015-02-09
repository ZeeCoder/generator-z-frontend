
### Generator-Z-Maintenance


#### Installation and Usage

run `npm install generator-z-maintenance -g`

After that, you can run `yo z-maintenance` from a project to start the
generator.

#### Description

This generator will provide a basic maintenance.html file, and a set of
.htaccess rules, to handle maintenance on a site.

Maintenance can then be activated by uploading an empty "maintenance" file to
the project's public folder.

#### Configuration

Since the some paths had to be provided as absolutes, every new environment will
need adjustments.

So for example for the site: *"http://site.com"*, the needed adjustmens would be
to replace every occurances of **"public_path/"** to an empty string.

Another example would be, if a developer has the project under the
*"localhost/a/long/path/project"* path. The developer then must replace every
occurances of **"public_path/"** to **"a/long/path/project/public_path/"**.

#### Collaboration, different environments

The way the .htaccess file needs to be configured means that it can not be
version controlled, since every environment needs a little tweak for every
developer. A way to store the htaccess file in the repository, is to save it as
".htaccess.dist" (Think of it as a template file.), so that every developer must
"implement" it as ".htaccess", having the latter ignored by the VCS.

This may seem to be a lot of work, but it's a well estabilished way to
collaborate on a project. (Just don't deploy "*.dist" files to production
environment.)

To see how the Symfony2 Framework uses this pattern, read [this article](http://symfony.com/doc/current/best_practices/configuration.html#canonical-parameters)
about the configuration.

For an easy to use setup page, which helps implementing these "*.dist" files,
please consider using [this generator](https://github.com/ZeeCoder/generator-z-dist-implementer).
