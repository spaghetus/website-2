#!/bin/bash
sudo chown $(whoami) -R wwebs-root
chmod o-x -R wwebs-root
chmod o+r -R wwebs-root
chmod u+x -R wwebs-root
chmod o+x $(find wwebs-root -type d)
chmod o+x $(find wwebs-root -name \*.sh)
chmod o+x $(find wwebs-root -name *.ts)
chmod o+x $(find wwebs-root -name .logger*)
chmod o+x $(find wwebs-root -name .gatekeeper*)
chmod o+x $(find wwebs-root -name .req_transformer*)
chmod o+x $(find wwebs-root -name .res_transformer*)
