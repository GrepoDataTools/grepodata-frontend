bypass the maintenance page by setting a `x-dev-test` request header with a value of `tF0BOCkzxs8HgG2Kw`.
[ModHeader](https://chrome.google.com/webstore/detail/modheader/idgpnmonknjnojddfkpgkljpfnnfcklj)

### Maintenance page
Place maintenance page in active frontend directory

### Edit .htaccess
Change the frontend .htaccess file to the following:
```
<IfModule mod_rewrite.c>
    RewriteEngine On
    <If "%{HTTP:x-dev-test} == 'tF0BOCkzxs8HgG2Kw'">
       RewriteBase /
       RewriteCond %{REQUEST_URI} !=/index.html
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
    </If>
    <Else>
       RewriteCond %{REQUEST_URI} !=/maintenance.html
       RewriteRule (.*) /maintenance.html [L]
    </Else>
</IfModule>
```
