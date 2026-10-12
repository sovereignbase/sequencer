 (func $9 (param $0 i32) (param $1 i32) (param $2 i32) (result i32)
  (local $3 i32)
  (local $4 i32)
  (local $5 i32)
  (local $6 i32)
  (local $7 i32)
  (local $8 i32)
  (local $9 i32)
  (local $10 i32)
  (local $11 i32)
  (local $12 i32)
  (local $13 i32)
  (local $14 i32)
  (local $15 i32)
  (local $16 i32)
  (local $17 i32)
  (local $18 i32)
  (local $19 i32)
  (local $20 i32)
  (local $21 i32)
  (local $22 i32)
  (local $23 i32)
  (local $24 i32)
  (local $25 i32)
  (local $26 i32)
  (local $27 i32)
  (local $28 i32)
  (local $29 i32)
  (local $30 i32)
  (local $31 i32)
  (local $32 i32)
  (local $33 i32)
  (local $34 i32)
  (local $35 i32)
  (local $36 i64)
  (local $37 i64)
  (local $38 i64)
  (local $39 i64)
  (local $40 f64)
  (local.set $30
   (global.get $global$0)
  )
  (local.set $36
   (i64.sub
    (i64.xor
     (local.tee $36
      (i64.sub
       (local.tee $38
        (i64.sub
         (i64.load32_u offset=96
          (local.get $0)
         )
         (i64.load32_s
          (i32.add
           (local.tee $17
            (i32.load offset=24
             (local.get $0)
            )
           )
           (i32.shl
            (local.tee $9
             (i32.load offset=84
              (local.get $0)
             )
            )
            (i32.const 2)
           )
          )
         )
        )
       )
       (local.tee $37
        (i64.extend_i32_u
         (local.get $1)
        )
       )
      )
     )
     (local.tee $36
      (i64.shr_s
       (local.get $36)
       (i64.const 63)
      )
     )
    )
    (local.get $36)
   )
  )
  (local.set $6
   (block $block1 (result i32)
    (block $block
     (br_if $block
      (i64.le_u
       (local.tee $39
        (i64.extend_i32_u
         (select
          (i32.sub
           (local.tee $3
            (i32.load offset=100
             (local.get $0)
            )
           )
           (local.get $1)
          )
          (i32.sub
           (local.get $1)
           (local.get $3)
          )
          (i32.lt_u
           (local.get $1)
           (local.get $3)
          )
         )
        )
       )
       (local.get $37)
      )
     )
     (br_if $block
      (i64.lt_u
       (local.get $36)
       (local.get $37)
      )
     )
     (local.set $9
      (i32.load
       (i32.add
        (i32.load offset=48
         (local.get $0)
        )
        (i32.shl
         (local.tee $13
          (i32.load offset=80
           (local.get $0)
          )
         )
         (i32.const 2)
        )
       )
      )
     )
     (local.set $38
      (i64.const 0)
     )
     (br $block1
      (local.get $13)
     )
    )
    (if
     (i64.ge_u
      (local.get $36)
      (local.get $39)
     )
     (then
      (local.set $38
       (i64.extend_i32_u
        (local.get $3)
       )
      )
      (local.set $13
       (i32.load offset=104
        (local.get $0)
       )
      )
      (local.set $9
       (i32.load offset=108
        (local.get $0)
       )
      )
      (br $block1
       (i32.load offset=88
        (local.get $0)
       )
      )
     )
    )
    (local.set $13
     (i32.load
      (i32.add
       (i32.load offset=44
        (local.get $0)
       )
       (i32.shl
        (local.get $9)
        (i32.const 2)
       )
      )
     )
    )
    (local.get $9)
   )
  )
  (local.set $40
   (call $32
    (f64.sqrt
     (f64.convert_i32_u
      (i32.load offset=92
       (local.get $0)
      )
     )
    )
   )
  )
  (block $block13
   (block $block4
    (block $block9
     (if
      (local.get $6)
      (then
       (local.set $16
        (i32.trunc_sat_f64_u
         (local.get $40)
        )
       )
       (local.set $31
        (i32.load offset=20
         (local.get $0)
        )
       )
       (local.set $10
        (i32.load offset=16
         (local.get $0)
        )
       )
       (local.set $29
        (i32.load offset=72
         (local.get $0)
        )
       )
       (local.set $32
        (i32.load offset=32
         (local.get $0)
        )
       )
       (local.set $18
        (i32.load offset=64
         (local.get $0)
        )
       )
       (local.set $19
        (i32.load offset=60
         (local.get $0)
        )
       )
       (local.set $20
        (i32.load offset=56
         (local.get $0)
        )
       )
       (local.set $21
        (i32.load offset=52
         (local.get $0)
        )
       )
       (local.set $27
        (i32.load offset=28
         (local.get $0)
        )
       )
       (local.set $8
        (i32.load offset=48
         (local.get $0)
        )
       )
       (local.set $11
        (i32.load offset=44
         (local.get $0)
        )
       )
       (local.set $14
        (local.get $6)
       )
       (local.set $39
        (local.get $38)
       )
       (loop $label
        (local.set $36
         (local.get $38)
        )
        (block $block2
         (if
          (i32.eqz
           (local.tee $3
            (i32.load
             (local.tee $15
              (i32.add
               (local.get $11)
               (local.tee $1
                (i32.shl
                 (local.tee $5
                  (local.get $6)
                 )
                 (i32.const 2)
                )
               )
              )
             )
            )
           )
          )
          (then
           (br_if $block2
            (i32.eqz
             (i32.load
              (i32.add
               (local.get $1)
               (local.get $8)
              )
             )
            )
           )
          )
         )
         (local.set $12
          (i32.const 0)
         )
         (local.set $39
          (local.get $36)
         )
         (local.set $14
          (local.get $5)
         )
        )
        (local.set $38
         (i64.add
          (local.get $36)
          (i64.extend_i32_u
           (select
            (local.tee $4
             (i32.load
              (i32.add
               (local.get $1)
               (local.get $17)
              )
             )
            )
            (i32.const 0)
            (i32.gt_s
             (local.get $4)
             (i32.const 0)
            )
           )
          )
         )
        )
        (block $block15
         (block $block3
          (br_if $block3
           (local.tee $4
            (i64.gt_s
             (local.get $36)
             (local.get $37)
            )
           )
          )
          (br_if $block3
           (i64.ge_s
            (local.get $37)
            (local.get $38)
           )
          )
          (if
           (i32.eqz
            (local.get $2)
           )
           (then
            (local.set $4
             (local.get $5)
            )
            (br $block4)
           )
          )
          (if
           (local.get $22)
           (then
            (local.set $4
             (local.get $5)
            )
            (br $block4)
           )
          )
          (local.set $22
           (i32.const 0)
          )
          (if
           (i64.ne
            (local.get $36)
            (local.get $37)
           )
           (then
            (local.set $4
             (local.get $5)
            )
            (br $block4)
           )
          )
          (if
           (i32.eqz
            (i32.load8_u
             (i32.add
              (local.get $5)
              (local.get $29)
             )
            )
           )
           (then
            (local.set $36
             (local.get $37)
            )
            (local.set $4
             (local.get $5)
            )
            (br $block4)
           )
          )
          (block $block14
           (block $block8
            (local.set $2
             (block $block11 (result i32)
              (block $block6
               (block $block5
                (br_if $block5
                 (i32.eqz
                  (local.tee $6
                   (i32.load
                    (i32.add
                     (local.get $1)
                     (local.get $27)
                    )
                   )
                  )
                 )
                )
                (br_if $block5
                 (i32.ge_s
                  (i32.load offset=20
                   (local.tee $4
                    (i32.add
                     (local.get $10)
                     (i32.mul
                      (local.get $6)
                      (i32.const 28)
                     )
                    )
                   )
                  )
                  (i32.const 0)
                 )
                )
                (br_if $block5
                 (i32.load offset=8
                  (local.get $4)
                 )
                )
                (br_if $block5
                 (i32.ne
                  (local.tee $7
                   (i32.load
                    (local.get $4)
                   )
                  )
                  (i32.load offset=12
                   (local.tee $15
                    (i32.add
                     (local.get $10)
                     (i32.mul
                      (local.get $5)
                      (i32.const 28)
                     )
                    )
                   )
                  )
                 )
                )
                (br_if $block5
                 (i32.ne
                  (local.tee $24
                   (i32.load offset=4
                    (local.get $4)
                   )
                  )
                  (i32.load offset=16
                   (local.get $15)
                  )
                 )
                )
                (br_if $block5
                 (i32.eqz
                  (local.tee $4
                   (i32.load
                    (i32.add
                     (local.get $27)
                     (i32.shl
                      (local.get $6)
                      (i32.const 2)
                     )
                    )
                   )
                  )
                 )
                )
                (br_if $block5
                 (i32.ne
                  (local.get $7)
                  (i32.load offset=12
                   (local.tee $7
                    (i32.add
                     (local.get $10)
                     (i32.mul
                      (local.get $4)
                      (i32.const 28)
                     )
                    )
                   )
                  )
                 )
                )
                (br_if $block5
                 (i32.ne
                  (i32.load offset=16
                   (local.get $7)
                  )
                  (local.get $24)
                 )
                )
                (br_if $block6
                 (i32.eqz
                  (i32.load8_u
                   (i32.add
                    (local.get $4)
                    (local.get $29)
                   )
                  )
                 )
                )
               )
               (block $block10
                (block $block7
                 (br_if $block7
                  (i32.eqz
                   (i32.load
                    (i32.add
                     (local.get $1)
                     (local.get $31)
                    )
                   )
                  )
                 )
                 (br_if $block8
                  (i64.ne
                   (local.get $37)
                   (i64.const 0)
                  )
                 )
                 (br_if $block7
                  (i32.ne
                   (i32.load
                    (local.tee $1
                     (i32.add
                      (local.get $10)
                      (i32.mul
                       (local.get $6)
                       (i32.const 28)
                      )
                     )
                    )
                   )
                   (i32.load offset=12
                    (local.tee $4
                     (i32.add
                      (local.get $10)
                      (i32.mul
                       (local.get $5)
                       (i32.const 28)
                      )
                     )
                    )
                   )
                  )
                 )
                 (local.set $36
                  (i64.const 0)
                 )
                 (br_if $block9
                  (i32.eqz
                   (local.get $6)
                  )
                 )
                 (br_if $block9
                  (i32.eq
                   (i32.load offset=4
                    (local.get $1)
                   )
                   (i32.load offset=16
                    (local.get $4)
                   )
                  )
                 )
                 (br $block10)
                )
                (br_if $block8
                 (i32.eqz
                  (local.get $6)
                 )
                )
               )
               (br_if $block8
                (i32.ge_s
                 (i32.load offset=20
                  (i32.add
                   (local.get $10)
                   (i32.mul
                    (local.get $6)
                    (i32.const 28)
                   )
                  )
                 )
                 (i32.const 0)
                )
               )
               (local.set $22
                (i32.sub
                 (i32.xor
                  (local.tee $1
                   (i32.load
                    (i32.add
                     (local.get $17)
                     (i32.shl
                      (local.get $6)
                      (i32.const 2)
                     )
                    )
                   )
                  )
                  (local.tee $1
                   (i32.shr_s
                    (local.get $1)
                    (i32.const 31)
                   )
                  )
                 )
                 (local.get $1)
                )
               )
               (local.set $4
                (local.get $6)
               )
               (br $block11
                (i32.const -1)
               )
              )
              (block $block12
               (br_if $block12
                (i32.load
                 (i32.add
                  (local.get $11)
                  (local.tee $1
                   (i32.shl
                    (local.get $6)
                    (i32.const 2)
                   )
                  )
                 )
                )
               )
               (br_if $block12
                (i32.load
                 (i32.add
                  (local.get $1)
                  (local.get $8)
                 )
                )
               )
               (br $block11
                (i32.const -2)
               )
              )
              (local.set $12
               (i32.const 1)
              )
              (local.set $39
               (local.get $37)
              )
              (local.set $14
               (local.get $6)
              )
              (i32.const -2)
             )
            )
            (if
             (i32.load
              (i32.add
               (local.get $11)
               (local.tee $1
                (i32.shl
                 (local.get $4)
                 (i32.const 2)
                )
               )
              )
             )
             (then
              (local.set $36
               (local.get $37)
              )
              (br $block13)
             )
            )
            (br_if $block14
             (i32.eqz
              (i32.load
               (i32.add
                (local.get $1)
                (local.get $8)
               )
              )
             )
            )
            (local.set $36
             (local.get $37)
            )
            (br $block13)
           )
           (if
            (i64.le_s
             (local.get $37)
             (i64.const 0)
            )
            (then
             (local.set $37
              (i64.const 0)
             )
             (local.set $36
              (i64.const 0)
             )
             (local.set $4
              (local.get $5)
             )
             (br $block4)
            )
           )
           (local.set $22
            (i32.const 1)
           )
           (local.set $6
            (local.get $5)
           )
           (local.set $37
            (i64.sub
             (local.tee $38
              (local.get $37)
             )
             (i64.const 1)
            )
           )
           (br $block15)
          )
          (local.set $12
           (i32.add
            (local.get $2)
            (local.get $12)
           )
          )
          (local.set $3
           (i32.const 0)
          )
          (local.set $36
           (local.get $37)
          )
          (br $block4)
         )
         (block $block20
          (block $block19
           (if
            (i32.eqz
             (local.get $4)
            )
            (then
             (local.set $6
              (i32.load
               (i32.add
                (local.get $1)
                (local.get $32)
               )
              )
             )
             (block $block16
              (br_if $block16
               (i32.eqz
                (local.tee $3
                 (i32.load
                  (local.tee $24
                   (i32.add
                    (local.get $1)
                    (local.get $8)
                   )
                  )
                 )
                )
               )
              )
              (br_if $block16
               (i64.lt_s
                (local.get $36)
                (i64.const 0)
               )
              )
              (local.set $7
               (i32.load
                (local.tee $23
                 (i32.add
                  (local.get $1)
                  (local.get $19)
                 )
                )
               )
              )
              (block $block17
               (if
                (i32.ge_u
                 (local.tee $4
                  (i32.load
                   (local.tee $26
                    (i32.add
                     (local.get $1)
                     (local.get $18)
                    )
                   )
                  )
                 )
                 (local.get $16)
                )
                (then
                 (local.set $1
                  (local.get $3)
                 )
                 (br $block17)
                )
               )
               (if
                (i32.eq
                 (i32.load offset=80
                  (local.get $0)
                 )
                 (local.get $3)
                )
                (then
                 (local.set $1
                  (local.get $3)
                 )
                 (br $block17)
                )
               )
               (if
                (i32.eq
                 (i32.load offset=84
                  (local.get $0)
                 )
                 (local.get $3)
                )
                (then
                 (local.set $1
                  (local.get $3)
                 )
                 (br $block17)
                )
               )
               (if
                (i32.eqz
                 (local.tee $1
                  (i32.load
                   (i32.add
                    (local.get $8)
                    (local.tee $15
                     (i32.shl
                      (local.get $3)
                      (i32.const 2)
                     )
                    )
                   )
                  )
                 )
                )
                (then
                 (local.set $1
                  (local.get $3)
                 )
                 (br $block17)
                )
               )
               (if
                (i32.gt_u
                 (local.tee $25
                  (i32.load
                   (i32.add
                    (local.get $15)
                    (local.get $18)
                   )
                  )
                 )
                 (i32.sub
                  (local.get $16)
                  (local.get $4)
                 )
                )
                (then
                 (local.set $1
                  (local.get $3)
                 )
                 (br $block17)
                )
               )
               (local.set $28
                (i32.load
                 (i32.add
                  (local.get $15)
                  (local.get $19)
                 )
                )
               )
               (if
                (i32.ne
                 (local.get $1)
                 (local.get $3)
                )
                (then
                 (i32.store
                  (i32.add
                   (local.get $11)
                   (local.get $15)
                  )
                  (i32.const 0)
                 )
                )
               )
               (local.set $4
                (i32.add
                 (local.get $4)
                 (local.get $25)
                )
               )
               (local.set $7
                (i32.add
                 (local.get $7)
                 (local.get $28)
                )
               )
               (block $block18
                (br_if $block18
                 (i32.eqz
                  (local.tee $15
                   (i32.load
                    (local.tee $25
                     (i32.add
                      (local.get $11)
                      (local.tee $3
                       (i32.shl
                        (local.get $1)
                        (i32.const 2)
                       )
                      )
                     )
                    )
                   )
                  )
                 )
                )
                (br_if $block18
                 (i32.eq
                  (local.get $5)
                  (local.get $15)
                 )
                )
                (i32.store
                 (i32.add
                  (local.get $8)
                  (i32.shl
                   (local.get $15)
                   (i32.const 2)
                  )
                 )
                 (i32.const 0)
                )
               )
               (i32.store
                (local.get $24)
                (local.get $1)
               )
               (i32.store
                (local.get $25)
                (local.get $5)
               )
               (i32.store
                (i32.add
                 (local.get $3)
                 (local.get $21)
                )
                (local.get $7)
               )
               (i32.store
                (local.get $23)
                (local.get $7)
               )
               (i32.store
                (i32.add
                 (local.get $3)
                 (local.get $20)
                )
                (local.get $4)
               )
               (i32.store
                (local.get $26)
                (local.get $4)
               )
              )
              (local.set $13
               (select
                (local.get $13)
                (local.get $5)
                (local.tee $3
                 (i64.gt_s
                  (local.get $37)
                  (local.tee $36
                   (i64.add
                    (local.get $36)
                    (i64.extend_i32_u
                     (local.get $7)
                    )
                   )
                  )
                 )
                )
               )
              )
              (local.set $9
               (select
                (local.get $9)
                (local.get $1)
                (local.get $3)
               )
              )
              (br_if $block19
               (i32.and
                (i32.ge_u
                 (local.get $4)
                 (i32.const 2)
                )
                (i64.le_s
                 (local.get $36)
                 (local.get $37)
                )
               )
              )
              (local.set $3
               (local.get $1)
              )
             )
             (local.set $13
              (select
               (i32.const 0)
               (select
                (local.get $5)
                (local.get $13)
                (local.get $3)
               )
               (local.tee $3
                (i32.eq
                 (local.get $6)
                 (local.tee $1
                  (select
                   (local.get $3)
                   (local.get $9)
                   (local.get $3)
                  )
                 )
                )
               )
              )
             )
             (local.set $9
              (select
               (i32.const 0)
               (local.get $1)
               (local.get $3)
              )
             )
             (local.set $12
              (i32.add
               (local.get $12)
               (i32.const 1)
              )
             )
             (br $block15)
            )
           )
           (local.set $24
            (i32.load
             (i32.add
              (local.get $17)
              (i32.shl
               (local.tee $6
                (i32.load
                 (i32.add
                  (local.get $1)
                  (local.get $27)
                 )
                )
               )
               (i32.const 2)
              )
             )
            )
           )
           (if
            (i32.eqz
             (local.get $3)
            )
            (then
             (local.set $1
              (i32.const 0)
             )
             (br $block20)
            )
           )
           (local.set $7
            (i32.load
             (local.tee $25
              (i32.add
               (local.get $1)
               (local.get $21)
              )
             )
            )
           )
           (block $block21
            (if
             (i32.ge_u
              (local.tee $4
               (i32.load
                (local.tee $28
                 (i32.add
                  (local.get $1)
                  (local.get $20)
                 )
                )
               )
              )
              (local.get $16)
             )
             (then
              (local.set $1
               (local.get $3)
              )
              (br $block21)
             )
            )
            (if
             (i32.eq
              (i32.load offset=80
               (local.get $0)
              )
              (local.get $3)
             )
             (then
              (local.set $1
               (local.get $3)
              )
              (br $block21)
             )
            )
            (if
             (i32.eq
              (i32.load offset=84
               (local.get $0)
              )
              (local.get $3)
             )
             (then
              (local.set $1
               (local.get $3)
              )
              (br $block21)
             )
            )
            (if
             (i32.eqz
              (local.tee $1
               (i32.load
                (i32.add
                 (local.get $11)
                 (local.tee $23
                  (i32.shl
                   (local.get $3)
                   (i32.const 2)
                  )
                 )
                )
               )
              )
             )
             (then
              (local.set $1
               (local.get $3)
              )
              (br $block21)
             )
            )
            (if
             (i32.gt_u
              (local.tee $33
               (i32.load
                (i32.add
                 (local.get $20)
                 (local.get $23)
                )
               )
              )
              (i32.sub
               (local.get $16)
               (local.get $4)
              )
             )
             (then
              (local.set $1
               (local.get $3)
              )
              (br $block21)
             )
            )
            (local.set $34
             (i32.load
              (i32.add
               (local.get $21)
               (local.get $23)
              )
             )
            )
            (block $block22
             (br_if $block22
              (i32.eqz
               (local.tee $26
                (i32.load
                 (local.tee $35
                  (i32.add
                   (local.get $8)
                   (local.tee $23
                    (i32.shl
                     (local.get $1)
                     (i32.const 2)
                    )
                   )
                  )
                 )
                )
               )
              )
             )
             (br_if $block22
              (i32.eq
               (local.get $5)
               (local.get $26)
              )
             )
             (i32.store
              (i32.add
               (local.get $11)
               (i32.shl
                (local.get $26)
                (i32.const 2)
               )
              )
              (i32.const 0)
             )
             (local.set $3
              (i32.load
               (local.get $15)
              )
             )
            )
            (local.set $4
             (i32.add
              (local.get $4)
              (local.get $33)
             )
            )
            (local.set $7
             (i32.add
              (local.get $7)
              (local.get $34)
             )
            )
            (block $block23
             (br_if $block23
              (i32.eqz
               (local.get $3)
              )
             )
             (br_if $block23
              (i32.eq
               (local.get $1)
               (local.get $3)
              )
             )
             (i32.store
              (i32.add
               (local.get $8)
               (i32.shl
                (local.get $3)
                (i32.const 2)
               )
              )
              (i32.const 0)
             )
            )
            (i32.store
             (local.get $35)
             (local.get $5)
            )
            (i32.store
             (local.get $15)
             (local.get $1)
            )
            (i32.store
             (local.get $25)
             (local.get $7)
            )
            (i32.store
             (i32.add
              (local.get $19)
              (local.get $23)
             )
             (local.get $7)
            )
            (i32.store
             (local.get $28)
             (local.get $4)
            )
            (i32.store
             (i32.add
              (local.get $18)
              (local.get $23)
             )
             (local.get $4)
            )
           )
           (local.set $13
            (select
             (local.get $13)
             (local.get $1)
             (local.tee $3
              (i64.gt_s
               (local.tee $38
                (i64.sub
                 (local.get $36)
                 (i64.extend_i32_u
                  (local.get $7)
                 )
                )
               )
               (local.get $37)
              )
             )
            )
           )
           (local.set $9
            (select
             (local.get $9)
             (local.get $5)
             (local.get $3)
            )
           )
           (br_if $block20
            (i32.lt_u
             (local.get $4)
             (i32.const 2)
            )
           )
           (br_if $block20
            (i64.gt_s
             (local.get $37)
             (local.get $38)
            )
           )
           (local.set $9
            (i32.const 0)
           )
           (local.set $13
            (i32.const 0)
           )
           (local.set $6
            (local.get $1)
           )
           (br $block15)
          )
          (local.set $9
           (i32.const 0)
          )
          (local.set $13
           (i32.const 0)
          )
          (local.set $6
           (local.get $1)
          )
          (local.set $38
           (local.get $36)
          )
          (br $block15)
         )
         (local.set $38
          (i64.sub
           (local.get $36)
           (i64.extend_i32_u
            (select
             (local.get $24)
             (i32.const 0)
             (i32.gt_s
              (local.get $24)
              (i32.const 0)
             )
            )
           )
          )
         )
         (local.set $13
          (select
           (i32.const 0)
           (local.tee $3
            (select
             (local.get $1)
             (local.get $13)
             (local.get $1)
            )
           )
           (local.tee $3
            (i32.eq
             (local.get $3)
             (local.get $6)
            )
           )
          )
         )
         (local.set $9
          (select
           (i32.const 0)
           (select
            (local.get $5)
            (local.get $9)
            (local.get $1)
           )
           (local.get $3)
          )
         )
         (local.set $12
          (i32.sub
           (local.get $12)
           (i32.const 1)
          )
         )
        )
        (br_if $label
         (local.get $6)
        )
       )
      )
     )
     (try $label1
      (do
       (local.set $0
        (call $25
         (local.tee $1
          (call $14)
         )
         (i32.const 1053)
        )
       )
      )
      (catch_all
       (global.set $global$0
        (local.get $30)
       )
       (call $18
        (i32.sub
         (local.get $1)
         (i32.const 80)
        )
       )
       (rethrow $label1)
      )
     )
     (call $13
      (local.get $0)
      (i32.const 1992)
      (i32.const 2)
     )
     (unreachable)
    )
    (local.set $37
     (i64.const 0)
    )
    (local.set $4
     (local.get $5)
    )
   )
   (block $block28
    (if
     (i32.gt_s
      (local.get $12)
      (i32.const 0)
     )
     (then
      (local.set $1
       (i32.wrap_i64
        (i64.sub
         (local.get $36)
         (local.get $39)
        )
       )
      )
      (block $block24
       (br_if $block24
        (i32.eqz
         (local.tee $2
          (i32.load
           (local.tee $5
            (i32.add
             (local.get $8)
             (local.tee $3
              (i32.shl
               (local.get $14)
               (i32.const 2)
              )
             )
            )
           )
          )
         )
        )
       )
       (local.set $3
        (i32.sub
         (i32.load
          (i32.add
           (local.get $3)
           (local.get $18)
          )
         )
         (block (result i32)
          (local.set $10
           (i32.load
            (i32.add
             (local.get $3)
             (local.get $19)
            )
           )
          )
          (block $block25
           (br_if $block25
            (i32.eqz
             (local.tee $3
              (i32.load
               (local.tee $16
                (i32.add
                 (local.get $8)
                 (i32.shl
                  (local.get $4)
                  (i32.const 2)
                 )
                )
               )
              )
             )
            )
           )
           (br_if $block25
            (i32.eq
             (local.get $2)
             (local.get $3)
            )
           )
           (i32.store
            (i32.add
             (local.get $11)
             (i32.shl
              (local.get $3)
              (i32.const 2)
             )
            )
            (i32.const 0)
           )
          )
          (local.get $12)
         )
        )
       )
       (local.set $6
        (i32.sub
         (local.get $10)
         (local.get $1)
        )
       )
       (block $block26
        (br_if $block26
         (i32.eqz
          (local.tee $7
           (i32.load
            (local.tee $17
             (i32.add
              (local.get $11)
              (local.tee $10
               (i32.shl
                (local.get $2)
                (i32.const 2)
               )
              )
             )
            )
           )
          )
         )
        )
        (br_if $block26
         (i32.eq
          (local.get $4)
          (local.get $7)
         )
        )
        (i32.store
         (i32.add
          (local.get $8)
          (i32.shl
           (local.get $7)
           (i32.const 2)
          )
         )
         (i32.const 0)
        )
       )
       (i32.store
        (local.get $16)
        (local.get $2)
       )
       (i32.store
        (local.get $17)
        (local.get $4)
       )
       (i32.store
        (i32.add
         (local.get $10)
         (local.get $21)
        )
        (local.get $6)
       )
       (i32.store
        (i32.add
         (local.get $19)
         (local.tee $2
          (i32.shl
           (local.get $4)
           (i32.const 2)
          )
         )
        )
        (local.get $6)
       )
       (i32.store
        (i32.add
         (local.get $10)
         (local.get $20)
        )
        (local.get $3)
       )
       (i32.store
        (i32.add
         (local.get $2)
         (local.get $18)
        )
        (local.get $3)
       )
       (br_if $block24
        (i32.eqz
         (local.tee $2
          (i32.load
           (local.get $5)
          )
         )
        )
       )
       (br_if $block24
        (i32.eq
         (local.get $2)
         (local.get $4)
        )
       )
       (i32.store
        (i32.add
         (local.get $11)
         (i32.shl
          (local.get $2)
          (i32.const 2)
         )
        )
        (i32.const 0)
       )
      )
      (block $block27
       (br_if $block27
        (i32.eqz
         (local.tee $2
          (i32.load
           (local.tee $3
            (i32.add
             (local.get $11)
             (i32.shl
              (local.get $4)
              (i32.const 2)
             )
            )
           )
          )
         )
        )
       )
       (br_if $block27
        (i32.eq
         (local.get $2)
         (local.get $14)
        )
       )
       (i32.store
        (i32.add
         (local.get $8)
         (i32.shl
          (local.get $2)
          (i32.const 2)
         )
        )
        (i32.const 0)
       )
      )
      (i32.store
       (local.get $5)
       (local.get $4)
      )
      (i32.store
       (local.get $3)
       (local.get $14)
      )
      (local.set $2
       (local.get $4)
      )
      (br $block28)
     )
    )
    (br_if $block13
     (i32.ge_s
      (local.get $12)
      (i32.const 0)
     )
    )
    (local.set $1
     (i32.wrap_i64
      (i64.sub
       (local.get $39)
       (local.get $36)
      )
     )
    )
    (if
     (local.tee $2
      (i32.load
       (local.tee $6
        (i32.add
         (local.get $11)
         (local.tee $5
          (i32.shl
           (local.get $14)
           (i32.const 2)
          )
         )
        )
       )
      )
     )
     (then
      (local.set $5
       (i32.add
        (i32.load
         (i32.add
          (local.get $5)
          (local.get $20)
         )
        )
        (block (result i32)
         (local.set $7
          (i32.load
           (i32.add
            (local.get $5)
            (local.get $21)
           )
          )
         )
         (block $block29
          (br_if $block29
           (i32.eqz
            (local.tee $5
             (i32.load
              (local.tee $16
               (i32.add
                (local.get $8)
                (i32.shl
                 (local.get $2)
                 (i32.const 2)
                )
               )
              )
             )
            )
           )
          )
          (br_if $block29
           (i32.eq
            (local.get $4)
            (local.get $5)
           )
          )
          (i32.store
           (i32.add
            (local.get $11)
            (i32.shl
             (local.get $5)
             (i32.const 2)
            )
           )
           (i32.const 0)
          )
          (local.set $3
           (i32.load
            (i32.add
             (local.get $11)
             (i32.shl
              (local.get $4)
              (i32.const 2)
             )
            )
           )
          )
         )
         (local.get $12)
        )
       )
      )
      (local.set $10
       (i32.sub
        (local.get $7)
        (local.get $1)
       )
      )
      (i32.store
       (i32.add
        (local.get $11)
        (local.tee $7
         (i32.shl
          (local.get $4)
          (i32.const 2)
         )
        )
       )
       (block (result i32)
        (block $block30
         (br_if $block30
          (i32.eqz
           (local.get $3)
          )
         )
         (br_if $block30
          (i32.eq
           (local.get $2)
           (local.get $3)
          )
         )
         (i32.store
          (i32.add
           (local.get $8)
           (i32.shl
            (local.get $3)
            (i32.const 2)
           )
          )
          (i32.const 0)
         )
        )
        (i32.store
         (local.get $16)
         (local.get $4)
        )
        (local.get $2)
       )
      )
      (i32.store
       (i32.add
        (local.get $7)
        (local.get $21)
       )
       (local.get $10)
      )
      (i32.store
       (i32.add
        (local.get $19)
        (local.tee $2
         (i32.shl
          (local.get $2)
          (i32.const 2)
         )
        )
       )
       (local.get $10)
      )
      (i32.store
       (i32.add
        (local.get $7)
        (local.get $20)
       )
       (local.get $5)
      )
      (i32.store
       (i32.add
        (local.get $2)
        (local.get $18)
       )
       (local.get $5)
      )
     )
    )
    (block $block31
     (br_if $block31
      (i32.eqz
       (local.tee $2
        (i32.load
         (local.tee $3
          (i32.add
           (local.get $8)
           (i32.shl
            (local.get $4)
            (i32.const 2)
           )
          )
         )
        )
       )
      )
     )
     (br_if $block31
      (i32.eq
       (local.get $2)
       (local.get $14)
      )
     )
     (i32.store
      (i32.add
       (local.get $11)
       (i32.shl
        (local.get $2)
        (i32.const 2)
       )
      )
      (i32.const 0)
     )
    )
    (block $block32
     (br_if $block32
      (i32.eqz
       (local.tee $2
        (i32.load
         (local.get $6)
        )
       )
      )
     )
     (br_if $block32
      (i32.eq
       (local.get $2)
       (local.get $4)
      )
     )
     (i32.store
      (i32.add
       (local.get $8)
       (i32.shl
        (local.get $2)
        (i32.const 2)
       )
      )
      (i32.const 0)
     )
    )
    (local.set $12
     (i32.sub
      (i32.const 0)
      (local.get $12)
     )
    )
    (i32.store
     (local.get $3)
     (local.get $14)
    )
    (i32.store
     (local.get $6)
     (local.get $4)
    )
    (local.set $2
     (local.get $14)
    )
    (local.set $14
     (local.get $4)
    )
   )
   (i32.store
    (i32.add
     (local.get $21)
     (local.tee $2
      (i32.shl
       (local.get $2)
       (i32.const 2)
      )
     )
    )
    (local.get $1)
   )
   (i32.store
    (i32.add
     (local.get $19)
     (local.tee $3
      (i32.shl
       (local.get $14)
       (i32.const 2)
      )
     )
    )
    (local.get $1)
   )
   (i32.store
    (i32.add
     (local.get $2)
     (local.get $20)
    )
    (local.get $12)
   )
   (i32.store
    (i32.add
     (local.get $3)
     (local.get $18)
    )
    (local.get $12)
   )
  )
  (local.set $1
   (i32.load
    (i32.add
     (local.get $8)
     (local.tee $2
      (i32.shl
       (local.get $4)
       (i32.const 2)
      )
     )
    )
   )
  )
  (i64.store32 offset=100
   (local.get $0)
   (local.get $36)
  )
  (i32.store offset=88
   (local.get $0)
   (local.get $4)
  )
  (i32.store offset=108
   (local.get $0)
   (select
    (local.get $1)
    (select
     (i32.const 0)
     (local.get $9)
     (local.tee $3
      (i32.eq
       (local.get $4)
       (local.get $9)
      )
     )
    )
    (local.get $1)
   )
  )
  (i32.store offset=104
   (local.get $0)
   (select
    (local.get $4)
    (select
     (i32.const 0)
     (local.get $13)
     (local.get $3)
    )
    (local.get $1)
   )
  )
  (i32.add
   (i32.add
    (i32.load
     (i32.add
      (i32.load offset=20
       (local.get $0)
      )
      (local.get $2)
     )
    )
    (i32.wrap_i64
     (i64.sub
      (local.get $37)
      (local.get $36)
     )
    )
   )
   (local.get $22)
  )
 )
